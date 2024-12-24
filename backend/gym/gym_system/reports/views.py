from django.db.models import Sum, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from clients.models import Attendance
from financials.serializers import *
from subscriptions.serializers import *
from shop.serializers import *
from django.conf import settings
from datetime import datetime, timedelta
from calendar import monthrange
from clients.serializers import ClientReadSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def statistics(request):
    clients = Client.objects.all()
    clients_count = clients.count()
    recently_clients = clients.filter(created_at__month=datetime.now().astimezone(settings.CAIRO_TZ).month).count()
    active_subscriptions = Subscription.get_active_subscriptions().count()
    recently_expired_subscriptions = Subscription.objects.filter(
        end_date=(datetime.now() - timedelta(days=1)).astimezone(settings.CAIRO_TZ)).count()
    today_barcode = Attendance.objects.filter(timestamp__day=datetime.now().astimezone(settings.CAIRO_TZ).day).count()
    sales = Sale.objects.all()
    today_sales = sales.filter(created_at__day=datetime.now().astimezone(settings.CAIRO_TZ).day).count()
    pending_sales = sales.filter(state="pending").count()
    transactions = Transaction.objects.all()
    today_incomes = transactions.filter(date=datetime.now().astimezone(settings.CAIRO_TZ).date(),
                                        category__financial_type="incomes")
    month_incomes = transactions.filter(date__month=datetime.now().astimezone(settings.CAIRO_TZ).month,
                                        date__year=datetime.now().astimezone(settings.CAIRO_TZ).year,
                                        category__financial_type="incomes")
    today_expenses = transactions.filter(date=datetime.now().astimezone(settings.CAIRO_TZ).date(),
                                         category__financial_type="expenses")
    month_expenses = transactions.filter(date__month=datetime.now().astimezone(settings.CAIRO_TZ).month,
                                         date__year=datetime.now().astimezone(settings.CAIRO_TZ).year,
                                         category__financial_type="expenses")
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


def get_response_data(request, incomes, expenses, subscriptions, clients, sales, products):
    response_data = {}

    total_expenses = sum(t.amount for t in expenses)
    total_incomes = sum(t.amount for t in incomes)
    expenses_serialized = TransactionReadSerializer(expenses, context={'request': request}, many=True).data
    incomes_serialized = TransactionReadSerializer(incomes, context={'request': request}, many=True).data
    response_data['expenses'] = expenses_serialized
    response_data['total_expenses'] = total_expenses
    response_data['incomes'] = incomes_serialized
    response_data['total_incomes'] = total_incomes

    total_subscriptions = sum(p.num_subscriptions for p in subscriptions)
    subscriptions_serialized = SubscriptionPlanSerializer(subscriptions, context={'request': request}, many=True).data
    response_data['subscriptions'] = subscriptions_serialized
    response_data['total_subscriptions'] = total_subscriptions

    clients_serialized = ClientReadSerializer(clients, context={'request': request}, many=True).data
    response_data['clients'] = clients_serialized
    response_data['total_clients'] = len(clients)

    sales_serialized = SaleSerializer(sales, context={'request': request}, many=True).data
    response_data['sales'] = sales_serialized
    response_data['total_sales'] = sum(s.total_price for s in sales)

    products_serialized = ProductReadSerializer(products, context={'request': request}, many=True).data
    response_data['products'] = products_serialized

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def daily_reports(request):
    day = request.GET.get('day')
    if day:
        day = datetime.strptime(day, '%Y-%m-%d')
        day = settings.CAIRO_TZ.localize(day).replace(hour=0, minute=0, second=0, microsecond=0)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Filter Transactions
    expenses = Transaction.objects.filter(date=day, category__financial_type="expenses")
    incomes = Transaction.objects.filter(date=day, category__financial_type="incomes")

    # Filter Subscriptions
    subscriptions = SubscriptionPlan.objects.annotate(
        num_subscriptions=Count('subscriptions', filter=Q(subscriptions__start_date=day))).filter(
        num_subscriptions__gt=0)

    # Filter Clients
    clients = Client.objects.filter(created_at__date=day)

    # Filter Sales
    sales = Sale.objects.filter(created_at__date=day, state="sold")

    # Filter Products
    products = (Product.objects.annotate(
        total_sold=Sum('saleitem__amount',
                       filter=Q(saleitem__sale__created_at__date=day) &
                              Q(saleitem__sale__state__exact="sold")))
                .filter(total_sold__gt=0))

    return get_response_data(request, incomes, expenses, subscriptions, clients, sales, products)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def duration_reports(request):
    # in case of month report
    month = request.GET.get('month')
    year = request.GET.get('year')

    # in case of duration report
    from_date = request.GET.get('from', None)
    to_date = request.GET.get('to', None)

    if month and year:
        month = int(month)
        year = int(year)
        start_date = datetime(year, month, 1, 0, 0, 0, 0)
        end_date = datetime(year, month, monthrange(year, month)[1], 23, 59, 59, 999999)
    elif from_date and to_date:
        start_date = datetime.strptime(from_date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = datetime.strptime(to_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)
    else:
        return Response(status=status.HTTP_404_NOT_FOUND)

    local_start = settings.CAIRO_TZ.localize(start_date)
    local_end = settings.CAIRO_TZ.localize(end_date)

    # Filter Transactions
    expenses = Transaction.objects.filter(date__gte=start_date, date__lte=end_date, category__financial_type="expenses")
    incomes = Transaction.objects.filter(date__gte=start_date, date__lte=end_date, category__financial_type="incomes")

    # Filter Subscriptions
    # subscriptions = Subscription.objects.filter(start_date=day)
    subscriptions = SubscriptionPlan.objects.annotate(
        num_subscriptions=Count('subscriptions', filter=Q(subscriptions__start_date__gte=start_date) &
                                                        Q(subscriptions__start_date__lte=end_date))).filter(
        num_subscriptions__gt=0)

    # Filter Clients
    clients = Client.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date)

    # Filter Sales
    sales = Sale.objects.filter(created_at__date__gte=start_date, created_at__date__lte=end_date, state="sold")

    # Filter Products
    products = (Product.objects.annotate(
        total_sold=Sum('saleitem__amount',
                       filter=Q(saleitem__sale__created_at__date__gte=start_date) &
                              Q(saleitem__sale__created_at__date__lte=end_date) &
                              Q(saleitem__sale__state__exact="sold")))
                .filter(total_sold__gt=0))

    return get_response_data(request, incomes, expenses, subscriptions, clients, sales, products)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def birthdays(request):
    today = datetime.now().astimezone(settings.CAIRO_TZ)
    clients = Client.objects.filter(birth_date__day=today.day, birth_date__month=today.month)
    clients_serialized = ClientReadSerializer(clients, context={'request': request}, many=True).data
    return Response(clients_serialized, status=status.HTTP_200_OK)
