from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.utils.timezone import datetime
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from datetime import datetime
from django.conf import settings
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


class SalaryViewSet(ModelViewSet):
    queryset = Salary.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SalaryWriteSerializer
        return SalaryReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        employee = self.request.query_params.get('employee', None)
        month = self.request.query_params.get('month', None)
        year = self.request.query_params.get('year', None)
        if employee and month and year:
            queryset = queryset.filter(employee=employee, month=month, year=year)
        return queryset


class AdvanceViewSet(ModelViewSet):
    queryset = Advance.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdvanceWriteSerializer
        return AdvanceReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(Q(id__icontains=search) | Q(employee__name__icontains=search))
        return queryset


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def employee_advance_info(request):
    employee_id = request.query_params.get('employee', None)
    employee = Employee.objects.get(id=employee_id)
    response_data = {}
    employee_advances = Advance.objects.filter(employee=employee)
    current_advance = employee_advances.filter(fully_paid=False).first()
    now = settings.CAIRO_TZ.localize(datetime.now())
    current_salary = Salary.objects.filter(employee=employee, year=now.year, month=now.month).first()
    current_salary = SalaryReadSerializer(current_salary, context={'request': request}).data
    response_data['current_salary'] = current_salary
    response_data['current_advance'] = AdvanceReadSerializer(current_advance, context={
        'request': request}).data if current_advance else None
    return Response(response_data, status=status.HTTP_200_OK)
