from clients.serializers import ClientReadSerializer
from django.db.models import Sum, Q, Count
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
from shop.models import Sale, Product
from shop.serializers import *
from django.utils.timezone import datetime, now, localtime, localdate, make_aware


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
    if day:
        day = datetime.strptime(day, '%Y-%m-%d').replace(hour=0, minute=0, second=0, microsecond=0)
        day = localtime(make_aware(day))
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)
    response_data = {}

    # Filter Transactions
    expenses = Transaction.objects.filter(date=day, category__financial_type="expenses")
    incomes = Transaction.objects.filter(date=day, category__financial_type="incomes")
    total_expenses = sum(t.amount for t in expenses)
    total_incomes = sum(t.amount for t in incomes)
    expenses_serialized = TransactionReadSerializer(expenses, context={'request': request}, many=True).data
    incomes_serialized = TransactionReadSerializer(incomes, context={'request': request}, many=True).data
    response_data['expenses'] = expenses_serialized
    response_data['total_expenses'] = total_expenses
    response_data['incomes'] = incomes_serialized
    response_data['total_incomes'] = total_incomes

    # Filter Subscriptions
    # subscriptions = Subscription.objects.filter(start_date=day)
    subscriptions = SubscriptionPlan.objects.annotate(
        num_subscriptions=Count('subscriptions', filter=Q(subscriptions__start_date=day))).filter(
        num_subscriptions__gt=0)
    total_subscriptions = sum(p.num_subscriptions for p in subscriptions)
    subscriptions_serialized = SubscriptionPlanSerializer(subscriptions, context={'request': request}, many=True).data
    response_data['subscriptions'] = subscriptions_serialized
    response_data['total_subscriptions'] = total_subscriptions

    # Filter Clients
    clients = Client.objects.filter(created_at__date=day)
    clients_serialized = ClientReadSerializer(clients, context={'request': request}, many=True).data
    response_data['clients'] = clients_serialized
    response_data['total_clients'] = len(clients)

    # Filter Sales
    sales = Sale.objects.filter(created_at__date=day, state="sold")
    sales_serialized = SaleSerializer(sales, context={'request': request}, many=True).data
    response_data['sales'] = sales_serialized
    response_data['total_sales'] = sum(s.total_price for s in sales)

    # Filter Products
    products = Product.objects.annotate(total_sold=Sum('saleitem__amount'),
                                        filter=Q(saleitem__sale__created_at__date=day)).filter(total_sold__gt=0)
    products_serialized = ProductReadSerializer(products, context={'request': request}, many=True).data
    response_data['products'] = products_serialized

    return Response(response_data, status=status.HTTP_200_OK)
