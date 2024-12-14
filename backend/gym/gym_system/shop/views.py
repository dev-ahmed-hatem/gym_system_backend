from django.db.models.functions import Lower
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
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


class ProductMobileViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductMobileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        if category and category != "all":
            queryset = queryset.annotate(category_name=Lower("category__name")).filter(category_name=category)
        return queryset


class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        date = self.request.query_params.get('date', None)
        client_id = self.request.query_params.get('client_id', None)

        if client_id:
            return queryset.filter(customer__id=client_id).order_by("-created_at", "-id")

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
        return SaleItemReadSerializer


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


class ClientMakeOrder(APIView):
    def post(self, request):
        items = request.data['items']
        client_id = request.data['client_id']

        # check client before creating order
        try:
            client = Client.objects.get(id=client_id)
            sale = Sale.objects.create(customer=client)
        except Client.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        order_list = []
        for item in items:
            try:
                product = Product.objects.get(pk=item['product_id'])
                amount = item['amount']
                new_item = SaleItem.objects.create(sale=sale, product=product, amount=amount)
                if product.has_discount() is not None:
                    new_item.price = product.sell_price - (product.sell_price * product.has_discount() / 100)
                    new_item.save()

                order_list.append(new_item)
            except Product.DoesNotExist:
                pass

        # raise error when products are no more available
        if len(order_list) == 0:
            sale.delete()
            return Response({}, status=status.HTTP_400_BAD_REQUEST)

        sale.items.set(order_list)
        sale.total_price = sum(item.total_price for item in order_list)
        sale.after_discount = sale.total_price
        sale.save()
        return Response(status=status.HTTP_200_OK)
