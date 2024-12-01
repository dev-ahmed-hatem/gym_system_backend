from users import permissions

from .models import *
from .serializers import *
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.utils.timezone import datetime, now
from django.conf import Settings
from django.core.mail import send_mail


class SubscriptionPlanViewSet(ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        sub_type = self.request.query_params.get('sub_type', None)
        if sub_type:
            queryset = queryset.filter(subscription_type=sub_type)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class SubscriptionViewSet(ModelViewSet):
    queryset = Subscription.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SubscriptionWriteSerializer
        return SubscriptionReadSerializer

    def get_queryset(self):
        # return a subscription with code param
        sub_code = self.request.query_params.get('code', None)
        client_id = self.request.query_params.get('client_id', None)

        if sub_code is not None:
            return Subscription.objects.filter(pk=sub_code)

        if client_id is not None:
            return Subscription.objects.filter(client__id=client_id).order_by('-start_date')

        queryset = super().get_queryset()
        from_date = self.request.query_params.get('from', None)
        to_date = self.request.query_params.get('to', None)
        if from_date and to_date:
            from_date = datetime.strptime(from_date, "%Y-%m-%d").date()
            to_date = datetime.strptime(to_date, "%Y-%m-%d").date()

            queryset = queryset.filter(Q(start_date__range=(from_date, to_date)))
        return queryset

    @action(detail=True, methods=['get'])
    def freeze(self, request, pk=None):
        subscription = self.get_object()
        if subscription.freeze_start_date:
            return Response({'detail': 'تم تعليق الاشتراك من قبل'}, status=status.HTTP_400_BAD_REQUEST)
        if subscription.is_frozen:
            return Response({'detail': 'اشتراك معلق بالفعل'}, status=status.HTTP_400_BAD_REQUEST)
        if subscription.freeze_days_used > subscription.plan.freeze_no:
            return Response({'detail': 'تخطى الحد الأقصى للتعليق'}, status=status.HTTP_400_BAD_REQUEST)
        subscription.freeze()
        return Response({'detail': 'تم تعليق الاشتراك'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def unfreeze(self, request, pk=None):
        subscription = self.get_object()
        if not subscription.is_frozen:
            return Response({'detail': 'الاشتراك مفعل'}, status=status.HTTP_400_BAD_REQUEST)
        subscription.unfreeze()
        return Response({'detail': 'تم إلغاء تعليق الاشتراك'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_subscriptions = (Subscription.get_active_subscriptions().filter(is_frozen=False)
                                .order_by("-start_date", "-id"))
        page = self.paginate_queryset(active_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(active_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def expired(self, request):
        current_date = now().astimezone(settings.CAIRO_TZ).date()
        expired_subscriptions = Subscription.objects.exclude(end_date__gte=current_date).order_by('-end_date', "-id")
        page = self.paginate_queryset(expired_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(expired_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def frozen(self, request):
        frozen_subscriptions = Subscription.objects.filter(is_frozen=True).order_by('-freeze_start_date', "-id")
        page = self.paginate_queryset(frozen_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = SubscriptionReadSerializer(frozen_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class InvitationViewSet(ModelViewSet):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def subscription_invitations(request):
    subscription_id = request.data.get('sub_id', None)
    if subscription_id:
        try:
            subscription = Subscription.objects.get(pk=subscription_id)
            subscription_serialized = SubscriptionReadSerializer(subscription, context={"request": request}).data
            invitations = Invitation.objects.filter(subscription=subscription)
            invitation_serialized = InvitationSerializer(invitations, context={"request": request}, many=True).data
            is_blocked = subscription.client.is_blocked
            editable = not subscription.is_expired() and not is_blocked and subscription.invitations_used < subscription.plan.invitations
            response_data = {
                "subscription": subscription_serialized,
                "invitations": invitation_serialized,
                "is_blocked": is_blocked,
                "editable": editable
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Subscription.DoesNotExist:
            return Response({"error": "كود اشتراك غير موجود"}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"detail": "Subscription id must be provided"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def send_invitation_mail(request):
    email = request.data.get('email', None)
    url = request.data.get('url', None)
    message = f"""مرحباً،
نود دعوتك للاستفادة من دعوة خاصة لزيارة PRO GYM
يمكنك استخدام الرابط أدناه للدخول إلى الدعوة والاستفادة من مميزاتنا الحصرية:
                    
{url}
                    
لأي استفسار، لا تتردد في التواصل معنا.
نتطلع لرؤيتك قريباً في PRO GYM!"""

    send_mail(

        'دعوة خاصة لزيارة PRO GYM',
        message,
        'PRO GYM',
        [email],
        fail_silently=False,
    )

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def invitation_data(request):
    key = request.data.get('key', None)
    fernet = Fernet(settings.FERNET_KEY.encode())
    decrypted_code = fernet.decrypt(key.encode()).decode()
    try:
        invitation = Invitation.objects.get(code=decrypted_code)
        invitation_serialized = InvitationSerializer(invitation, context={"request": request}).data
        return Response({**invitation_serialized, "end_date": invitation.subscription.end_date}, status.HTTP_200_OK)
    except Invitation.DoesNotExist:
        return Response({"error": "invalid invitation code"}, status=status.HTTP_404_NOT_FOUND)
