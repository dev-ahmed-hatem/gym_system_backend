from .models import *
from .serializers import *
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
