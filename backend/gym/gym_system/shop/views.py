from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, permission_classes, action
from django.utils.timezone import datetime, localtime, make_aware, now
from financials.models import FinancialItem, Transaction


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
            local_date = localtime(make_aware(datetime.strptime(date, '%Y-%m-%d'))).date()
            queryset = queryset.filter(created_at__date=local_date)
        return queryset

    @action(methods=['get'], detail=True)
    def confirm_sale(self, request, pk=None):
        sale = Sale.objects.get(id=pk)
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
                                             date=now().date(),
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
