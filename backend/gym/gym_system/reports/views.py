from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from financials.models import *
from financials.serializers import *
from subscriptions.models import *
from subscriptions.serializers import *
from django.utils.timezone import datetime


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
