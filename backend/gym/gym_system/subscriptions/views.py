from .models import *
from .serializers import *
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


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
        sub_code = self.request.query_params.get('code', None)
        if sub_code is not None:
            return Subscription.objects.filter(pk=sub_code)
        queryset = super().get_queryset()

        return queryset

    @action(detail=True, methods=['get'])
    def freeze(self, request, pk=None):
        subscription = self.get_object()
        if subscription.is_frozen:
            return Response({'detail': 'اشتراك معلق بالفعل'}, status=status.HTTP_400_BAD_REQUEST)
        if subscription.freeze_days_used > subscription.plan.freeze_no:
            return Response({'detail': 'تخطى الحد الأقصى للتعليق'}, status=status.HTTP_400_BAD_REQUEST)
        subscription.freeze()
        return Response({'detail': 'Subscription has been frozen'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['get'])
    def unfreeze(self, request, pk=None):
        subscription = self.get_object()
        if not subscription.is_frozen:
            return Response({'detail': 'الاشتراك مفعل'}, status=status.HTTP_400_BAD_REQUEST)
        subscription.unfreeze()
        return Response({'detail': 'Subscription has been unfrozen'}, status=status.HTTP_200_OK)
