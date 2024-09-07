from datetime import datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from cryptography.fernet import Fernet
from django.conf import settings
from django.db.models import Q
from .serializers import *
from subscriptions.serializers import SubscriptionReadSerializer
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
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)

        if from_date and to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = datetime.strptime(to_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)
            
            local_from = settings.CAIRO_TZ.localize(from_date)
            local_to = settings.CAIRO_TZ.localize(to_date)

            queryset = queryset.filter(
                Q(created_at__gte=local_from) &
                Q(created_at__lte=local_to)
            )

        if search:
            queryset = queryset.filter(
                Q(id__icontains=search) |
                Q(name__icontains=search) |
                Q(national_id__icontains=search) |
                Q(phone__icontains=search) |
                Q(phone2__icontains=search))
        return queryset


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
            queryset = queryset.filter(client=int(client))

        if from_date and to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = datetime.strptime(to_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)

            local_from = settings.CAIRO_TZ.localize(from_date)
            local_to = settings.CAIRO_TZ.localize(to_date)
            queryset = queryset.filter(
                Q(timestamp__gte=local_from) &
                Q(timestamp__lte=local_to)
            )
        return queryset


@api_view(['POST'])
def scanner_code(request):
    code: str = request.data['code']
    try:
        if code.isdigit():
            code = int(code)
        else:
            fernet = Fernet(settings.FERNET_KEY.encode())
            data = fernet.decrypt(code.encode())
            code = data.decode()
    except:
        return Response({'error': 'كود غير صالح'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        client = Client.objects.get(id=code)
        active_subscriptions = client.subscriptions.filter(end_date__gte=now().date())
        serilized_subscriptions = SubscriptionReadSerializer(active_subscriptions, context={"request": request},
                                                             many=True).data
        serialized_client = ClientReadSerializer(client, context={"request": request}).data
    except Client.DoesNotExist:
        return Response({'error': 'كود عميل غير موجود'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'code': code, "client": serialized_client, "subscriptions": serilized_subscriptions})
