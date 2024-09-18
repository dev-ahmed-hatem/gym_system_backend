from .models import *
from .serializers import *
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.utils.timezone import datetime, now
from django.conf import Settings


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
        if sub_code is not None:
            return Subscription.objects.filter(pk=sub_code)

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
        active_subscriptions = Subscription.get_active_subscriptions().filter(is_frozen=False).order_by("-start_date")
        page = self.paginate_queryset(active_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(active_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def expired(self, request):
        # active_subscriptions = Subscription.get_active_subscriptions()
        # expired_subscriptions = Subscription.objects.filter(~Q(id__in=active_subscriptions)).order_by('-end_date')
        current_date = now().astimezone(settings.CAIRO_TZ).date()
        expired_subscriptions = Subscription.objects.exclude(end_date__gte=current_date).order_by('-end_date')
        page = self.paginate_queryset(expired_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(expired_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def frozen(self, request):
        frozen_subscriptions = Subscription.objects.filter(is_frozen=True).order_by('-freeze_start_date')
        page = self.paginate_queryset(frozen_subscriptions)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = SubscriptionReadSerializer(frozen_subscriptions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
