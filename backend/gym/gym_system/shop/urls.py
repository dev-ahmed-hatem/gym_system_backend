from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register('product-category', ProductCategoryViewSet, basename='product-category')
router.register('product', ProductViewSet, basename='product')
router.register('product-mobile', ProductMobileViewSet, basename='product-mobile')
router.register('sale', SaleViewSet, basename='sale')
router.register('sale-item', SaleItemViewSet, basename='sale-item')
router.register('offer', OfferViewSet, basename='offer')

urlpatterns = [
    path('', include(router.urls)),
    path('add-stock/', add_stock, name='add-stock'),
]
