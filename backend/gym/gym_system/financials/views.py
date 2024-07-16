from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *


class FinancialItemViewSet(ModelViewSet):
    queryset = FinancialItem.objects.all()
    serializer_class = FinancialItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            return queryset.filter(name__icontains=search)

        return queryset
