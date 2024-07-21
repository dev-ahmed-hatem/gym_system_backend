from rest_framework import serializers
from .models import *
from clients.serializers import ClientReadSerializer


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = '__all__'


class ProductReadSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer()

    class Meta:
        model = Product
        fields = '__all__'


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'


class SaleReadSerializer(serializers.ModelSerializer):
    total_quantity = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()
    customer = ClientReadSerializer()
    sale_items = SaleItemSerializer(source='saleitem_set', many=True)

    class Meta:
        model = Sale
        fields = '__all__'

    def get_total_quantity(self, obj):
        return obj.total_quantity

    def get_total_price(self, obj):
        return obj.total_price

class SaleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'