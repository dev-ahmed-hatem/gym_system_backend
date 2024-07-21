from rest_framework.viewsets import ModelViewSet
from .serializers import *
from .models import *


class ProductCategoryViewSet(ModelViewSet):
    serializer_class = ProductCategorySerializer
    queryset = ProductCategory.objects.all()


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductWriteSerializer
        return ProductReadSerializer


class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return SaleWriteSerializer
        return SaleReadSerializer


class SaleItemViewSet(ModelViewSet):
    queryset = SaleItem.objects.all()
    serializer_class = SaleItemSerializer
