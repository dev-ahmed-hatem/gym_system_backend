from rest_framework.viewsets import ModelViewSet
from django.utils.timezone import datetime
from .serializers import *
from .models import *


class FinancialItemViewSet(ModelViewSet):
    queryset = FinancialItem.objects.all()
    serializer_class = FinancialItemSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        type = self.request.query_params.get('type', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        if type:
            queryset = queryset.filter(financial_type__icontains=type)
        return queryset


class TransactionViewSet(ModelViewSet):
    queryset = Transaction.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TransactionWriteSerializer
        return TransactionReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        type = self.request.query_params.get('type', None)
        date = self.request.query_params.get('date', None)
        if search:
            queryset = queryset.filter(category__name__icontains=search)
        if type:
            queryset = queryset.filter(category__financial_type=type)
        if date:
            queryset = queryset.filter(date=datetime.strptime(date, '%Y-%m-%d'))
        return queryset
