from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register('product-category', ProductCategoryViewSet, basename='product-category')
router.register('product', ProductViewSet, basename='product')
router.register('sale', SaleViewSet, basename='sale')
router.register('sale-item', SaleItemViewSet, basename='sale-item')

urlpatterns = [
    path('', include(router.urls)),
]
