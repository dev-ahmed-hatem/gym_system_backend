import pytz
import os
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, action
from cryptography.fernet import Fernet
from django.conf import settings
from django.db.models import Q, F
from subscriptions.models import Invitation

from .serializers import *
from subscriptions.serializers import SubscriptionReadSerializer, InvitationSerializer
from .models import *


class ClientViewSet(ModelViewSet):
    queryset = Client.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ClientWriteSerializer
        return ClientReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        client = self.request.query_params.get('client', None)
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)

        if client is not None:
            if client.isdigit():
                queryset = Client.objects.filter(id=client)
                if queryset.exists():
                    return queryset
                else:
                    return queryset.none()
            else:
                search = client

        if from_date and to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = datetime.strptime(to_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)

            local_from = settings.CAIRO_TZ.localize(from_date)
            local_to = settings.CAIRO_TZ.localize(to_date)

            utc_from = local_from.astimezone(pytz.UTC)
            utc_to = local_to.astimezone(pytz.UTC)

            queryset = queryset.filter(
                Q(created_at__range=(utc_from, utc_to))
            )

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(name__icontains=search) |
                Q(national_id__icontains=search) |
                Q(phone__icontains=search) |
                Q(phone2__icontains=search))
        return queryset

    @action(detail=True, methods=['PATCH'])
    def change_id(self, request, pk=None):
        client = self.get_object()
        new_id = request.data.get('new_id')
        try:
            c = Client.objects.get(id=new_id)
            if c:
                return Response({"new_id": "كود غير متاح"}, status=status.HTTP_400_BAD_REQUEST)
        except Client.DoesNotExist:
            client.id = new_id
            if client.qr_code:
                if os.path.isfile(client.qr_code.path):
                    os.remove(client.qr_code.path)
            if client.barcode:
                if os.path.isfile(client.barcode.path):
                    os.remove(client.barcode.path)
            # client.generate_barcode()
            # client.generate_qr_code()
            client.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AttendanceViewSet(ModelViewSet):
    queryset = Attendance.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AttendanceWriteSerializer
        return AttendanceReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)
        client = self.request.query_params.get('client', None)

        if client is not None:
            queryset = queryset.filter(client__id__exact=int(client))

        if from_date and to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = datetime.strptime(to_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)

            local_from = settings.CAIRO_TZ.localize(from_date)
            local_to = settings.CAIRO_TZ.localize(to_date)

            utc_from = local_from.astimezone(pytz.UTC)
            utc_to = local_to.astimezone(pytz.UTC)

            queryset = queryset.filter(
                Q(timestamp__range=(utc_from, utc_to))
            )
        return queryset

    def destroy(self, request, *args, **kwargs):
        attendance = self.get_object()
        subscription = attendance.subscription
        if attendance.guest:
            inv = Invitation.objects.get(code=attendance.invitation_code)
            inv.is_used = False
            inv.save()
            subscription.invitations_used -= 1
        else:
            subscription.attendance_days -= 1
        subscription.save()
        return super().destroy(self, request, *args, **kwargs)


@api_view(["GET"])
def get_next_client_id(request):
    last_id = Client.objects.order_by("-created_at").first().id
    next_id = int(last_id) + 1
    while True:
        try:
            Client.objects.get(id=next_id)
            next_id += 1
        except Client.DoesNotExist:
            return Response({"id": next_id}, status=status.HTTP_200_OK)


def get_client_active_subscriptions(client: Client):
    current_date = now().astimezone(settings.CAIRO_TZ).date()

    active_subscriptions = client.subscriptions.filter(
        start_date__lte=current_date,
        end_date__gte=current_date,
        is_frozen=False
    ).exclude(
        Q(plan__is_duration=False) &
        Q(attendance_days__gte=F('plan__classes_no'))
    )
    return active_subscriptions


def is_client_attended_today(client: Client):
    current_date = now().astimezone(settings.CAIRO_TZ).date()
    attendances = Attendance.objects.filter(client=client)
    for attendance in attendances:
        if attendance.timestamp.astimezone(settings.CAIRO_TZ).date() == current_date:
            return True


@api_view(['POST'])
def scanner_code(request):
    code: str = request.data.get('code')
    if code.startswith("i-"):
        try:
            invitation = Invitation.objects.get(code=code)
            invitation_serialized = InvitationSerializer(invitation, context={'request': request}).data
            subscription = SubscriptionReadSerializer(invitation.subscription, context={'request': request}).data
            return Response({"invitation": invitation_serialized,
                             "subscription": {"is_blocked": invitation.subscription.client.is_blocked, **subscription}})
        except Invitation.DoesNotExist:
            return Response({'error': 'كود دعوة غير صالج'}, status=status.HTTP_400_BAD_REQUEST)
    if code.isdigit():
        try:
            code = int(code)
        except ValueError:
            return Response({"error": "قيمة غير صالحة"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        fernet = Fernet(settings.FERNET_KEY.encode())
        data = fernet.decrypt(code.encode())
        code = data.decode()

    try:
        client = Client.objects.get(id=code)
        active_subscriptions = get_client_active_subscriptions(client)
        serialized_subscriptions = SubscriptionReadSerializer(active_subscriptions,
                                                              context={"request": request},
                                                              many=True).data
        serialized_client = ClientReadSerializer(client, context={"request": request}).data
        is_attended = is_client_attended_today(client)

        return Response({'code': code, "client": serialized_client, "subscriptions": serialized_subscriptions,
                         "is_attended": is_attended})

    except Client.DoesNotExist:
        return Response({'error': 'عميل غير موجود'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def scanner_mobile(request):
    mobile: str = request.data.get('mobile')
    try:
        client = Client.objects.get(Q(phone=mobile) | Q(phone2=mobile))
        active_subscriptions = get_client_active_subscriptions(client)
        serialized_subscriptions = SubscriptionReadSerializer(active_subscriptions,
                                                              context={"request": request},
                                                              many=True).data
        serialized_client = ClientReadSerializer(client, context={"request": request}).data
        is_attended = is_client_attended_today(client)

        return Response(
            {"client": serialized_client, "subscriptions": serialized_subscriptions, "is_attended": is_attended})

    except Client.DoesNotExist:
        return Response({'error': 'عميل غير موجود'}, status=status.HTTP_404_NOT_FOUND)


class ClientLogin(APIView):
    def post(self, request):
        id = request.data.get('id')
        password = request.data.get('password')

        if not id or not password:
            return Response({"error": "ID and Password must be provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = Client.objects.get(id=id)

            if client.password == "unset":
                if password == client.phone:
                    return Response(ClientMobileSerializer(client, context={"request": request}).data,
                                    status=status.HTTP_200_OK)
            else:
                if client.check_password(password):
                    return Response(ClientMobileSerializer(client, context={"request": request}).data,
                                    status=status.HTTP_200_OK)
            return Response({"error": "incorrect password"}, status=status.HTTP_400_BAD_REQUEST)

        except Client.DoesNotExist:
            return Response({"error": "ID is not found!"}, status=status.HTTP_404_NOT_FOUND)


class ClientLatestSubscriptions(APIView):
    def post(self, request):
        current_date = now().astimezone(settings.CAIRO_TZ).date()

        id = request.data.get('id')
        client = Client.objects.get(id=id)

        active_subscriptions = client.subscriptions.filter(
            start_date__lte=current_date,
            end_date__gte=current_date,
        ).exclude(
            Q(plan__is_duration=False) & Q(attendance_days__gte=F("plan__classes_no"))
        )

        if active_subscriptions.count() < 3:
            needed = 3 - active_subscriptions.count()
            latest_subscription = client.subscriptions.exclude(id__in=active_subscriptions)
            active_subscriptions = list(active_subscriptions.order_by("-id")) + list(
                latest_subscription.order_by("-id"))[:needed]

        return Response(
            SubscriptionReadSerializer(active_subscriptions, many=True, context={"request": request}).data)


class GetClientData(APIView):
    def post(self, request):
        id = request.data.get('id')
        try:
            client = Client.objects.get(id=id)
            return Response(ClientMobileSerializer(client, context={"request": request}).data,
                            status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"error": "ID is not found!"}, status=status.HTTP_404_NOT_FOUND)
