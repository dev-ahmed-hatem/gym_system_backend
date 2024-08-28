from rest_framework import serializers
from rest_framework.response import Response

from .models import *
from clients.serializers import ClientReadSerializer
from django.utils.timezone import localtime


class ProductCategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-category-detail', lookup_field='pk')

    class Meta:
        model = ProductCategory
        fields = '__all__'


class ProductReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-detail', lookup_field='pk')
    category = ProductCategorySerializer()

    class Meta:
        model = Product
        fields = '__all__'


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class SaleItemReadSeializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='sale-item-detail')
    total_price = serializers.SerializerMethodField()
    product = ProductReadSerializer(read_only=True)

    class Meta:
        model = SaleItem
        fields = '__all__'

    def get_total_price(self, obj):
        return obj.total_price


class SaleItemWriteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='sale-item-detail')

    class Meta:
        model = SaleItem
        fields = '__all__'


class SaleSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='sale-detail')
    total_quantity = serializers.SerializerMethodField()
    customer = ClientReadSerializer(read_only=True)
    items = SaleItemReadSeializer(many=True, read_only=True)
    date = serializers.SerializerMethodField()
    state = serializers.SerializerMethodField()
    confirm_date = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = '__all__'

    def get_total_quantity(self, obj):
        return obj.total_quantity

    def get_date(self, obj):
        return f"{localtime(obj.created_at):%Y-%m-%d}"

    def get_confirm_date(self, obj):
        return f"{localtime(obj.confirmed_at):%Y-%m-%d - %H:%M}"

    def get_state(self, obj):
        return obj.get_state_display()

    def create(self, validated_data):
        sale = Sale(**validated_data)
        sale.save()
        products = self.initial_data.get("products", [])
        for item in products:
            product = Product.objects.get(pk=item["product_id"])
            sale_item = SaleItem.objects.create(sale=sale, amount=item["amount"], product=product)
            sale_item.save()

        sale.save()
        return sale
