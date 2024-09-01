from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from clients.models import Client, Attendance
from subscriptions.models import Subscription
from financials.models import *
from financials.serializers import *
from subscriptions.models import *
from subscriptions.serializers import *
from shop.models import Sale
from django.utils.timezone import datetime, now, localtime, localdate


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistics(request):
    clients = Client.objects.all()
    clients_count = clients.count()
    recently_clients = clients.filter(created_at__month=localdate(now()).month).count()
    active_subscriptions = Subscription.get_active_subscriptions().count()
    recently_expired_subscriptions = Subscription.objects.filter(end_date__day=localdate(now()).day).count()
    today_barcode = Attendance.objects.filter(timestamp__day=localdate(now()).day).count()
    sales = Sale.objects.all()
    today_sales = sales.filter(created_at__day=localdate(now()).day).count()
    pending_sales = sales.filter(state="pending").count()
    transactions = Transaction.objects.all()
    today_incomes = transactions.filter(date__day=localdate(now()).day, category__financial_type="incomes")
    month_incomes = transactions.filter(date__month=localdate(now()).month, category__financial_type="incomes")
    today_expenses = transactions.filter(date__day=localdate(now()).day, category__financial_type="expenses")
    month_expenses = transactions.filter(date__month=localdate(now()).month, category__financial_type="expenses")
    response_data = {
        'clients_count': clients_count,
        'recently_clients': recently_clients,
        'active_subscriptions': active_subscriptions,
        'recently_expired_subscriptions': recently_expired_subscriptions,
        'today_barcode': today_barcode,
        'today_sales': today_sales,
        'pending_sales': pending_sales,
        'today_incomes': sum(t.amount for t in today_incomes),
        'month_incomes': sum(t.amount for t in month_incomes),
        'today_expenses': sum(t.amount for t in today_expenses),
        'month_expenses': sum(t.amount for t in month_expenses),
    }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_reports(request):
    day = request.GET.get('day')
    day = datetime.strptime(day, '%Y-%m-%d').date()
    response_data = {}

    # Filter Transactions
    expenses = Transaction.objects.filter(date=day, category__financial_type="expenses")
    incomes = Transaction.objects.filter(date=day, category__financial_type="incomes")
    expenses_serialized = TransactionReadSerializer(expenses, many=True).data
    incomes_serialized = TransactionReadSerializer(incomes, many=True).data
    response_data['expenses_serialized'] = expenses_serialized
    response_data['incomes_serialized'] = incomes_serialized

    # Filter Subscriptions
    subscriptions = Subscription.objects.filter(start_date=day)
    subscriptions_serialized = SubscriptionReadSerializer(subscriptions, many=True).data
    response_data['subscriptions_serialized'] = subscriptions_serialized
    return Response(response_data, status=status.HTTP_200_OK)
