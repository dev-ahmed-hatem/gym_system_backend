from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, permission_classes, action
from django.utils.timezone import datetime, now
from django.conf import settings
from financials.models import FinancialItem, Transaction
import pytz


class ProductCategoryViewSet(ModelViewSet):
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        return ProductReadSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        date = self.request.query_params.get('date', None)

        if search:
            queryset = queryset.filter(id__icontains=search)
        if date:
            from_date = datetime.strptime(date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0)
            to_date = datetime.strptime(date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)

            local_from = settings.CAIRO_TZ.localize(from_date)
            local_to = settings.CAIRO_TZ.localize(to_date)

            utc_from = local_from.astimezone(pytz.UTC)
            utc_to = local_to.astimezone(pytz.UTC)

            queryset = queryset.filter(created_at__range=(utc_from, utc_to))
        return queryset

    @action(methods=['get'], detail=True)
    def confirm_sale(self, request, pk=None):
        sale = Sale.objects.get(id=pk)
        items = sale.items
        insufficient = []
        for item in items.all():
            stock = item.product.stock
            amount = item.amount
            if amount > stock:
                insufficient.append(item.product.name)

        if len(insufficient) > 0:
            return Response({"detail": "insufficient", 'insufficient_items': insufficient},
                            status=status.HTTP_400_BAD_REQUEST)

        for item in items.all():
            product = item.product
            amount = item.amount
            product.stock -= amount
            product.save()

        sale.confirm_sale()
        return Response(status=status.HTTP_200_OK)


class SaleItemViewSet(ModelViewSet):
    queryset = SaleItem.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SaleItemWriteSerializer
        return SaleItemReadSeializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_stock(request):
    product_id = request.data['product_id']
    amount = request.data['amount']

    product = Product.objects.get(pk=product_id)
    product.stock += int(amount)
    product.save()

    # create transaction
    financial_item, _ = FinancialItem.objects.get_or_create(name="مصاريف منتجات", financial_type="expenses",
                                                            system_related=True)
    transaction = Transaction.objects.create(category=financial_item,
                                             date=now().astimezone(settings.CAIRO_TZ).date(),
                                             amount=product.cost_price * int(amount)
                                             )
    transaction.save()
    return Response(status=status.HTTP_201_CREATED)


class OfferViewSet(ModelViewSet):
    queryset = Offer.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OfferWriteSerializer
        return OfferReadSerializer
