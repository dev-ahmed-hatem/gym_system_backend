from .models import *
from .serializers import *
from rest_framework.viewsets import ModelViewSet


class SubscriptionPlanViewSet(ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class LockerPlanViewSet(ModelViewSet):
    queryset = LockerPlan.objects.all()
    serializer_class = LockerPlanSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class AdditionalPlanViewSet(ModelViewSet):
    queryset = AdditionalPlan.objects.all()
    serializer_class = AdditionalPlanSerializer
