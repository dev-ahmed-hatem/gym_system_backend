from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *
from rest_framework.decorators import api_view, permission_classes


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

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SaleWriteSerializer
        return SaleReadSerializer


class SaleItemViewSet(ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_stock(request):
    product_id = request.data['product_id']
    amount = request.data['amount']

    product = Product.objects.get(pk=product_id)
    product.stock += int(amount)
    product.save()
    return Response(status=status.HTTP_201_CREATED)
