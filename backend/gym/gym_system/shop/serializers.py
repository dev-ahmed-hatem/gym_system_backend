from rest_framework import serializers
from rest_framework.response import Response
from subscriptions.serializers import SubscriptionPlanSerializer
from subscriptions.models import SubscriptionPlan
from django.utils.timezone import datetime

from .models import *
from clients.serializers import ClientReadSerializer
from django.conf import settings


class ProductCategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-category-detail', lookup_field='pk')

    class Meta:
        model = ProductCategory
        fields = '__all__'


class ProductReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='product-detail', lookup_field='pk')
    category = ProductCategorySerializer()
    total_sold = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_total_sold(self, obj):
        if hasattr(obj, 'total_sold'):
            return obj.total_sold
        return None


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
        return f"{obj.created_at.astimezone(settings.CAIRO_TZ):%Y-%m-%d}"

    def get_confirm_date(self, obj):
        return f"{obj.confirmed_at.astimezone(settings.CAIRO_TZ):%Y-%m-%d - %H:%M}"

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


class OfferReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='offer-detail')
    product = ProductReadSerializer(read_only=True)
    plan = SubscriptionPlanSerializer(read_only=True)
    offer_type_display = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = '__all__'

    def get_offer_type_display(self, obj):
        return obj.get_offer_type_display()


class OfferWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = '__all__'

    def create(self, validated_data):
        item_id = self.initial_data["item_id"]
        start_date = datetime.strptime(self.initial_data["start_date"], "%Y-%m-%d").date()
        end_date = datetime.strptime(self.initial_data["end_date"], "%Y-%m-%d").date()
        percentage = self.initial_data["percentage"]
        offer_type = self.initial_data["offer_type"]

        offer_data = {
            "offer_type": offer_type,
            "percentage": percentage,
            "start_date": start_date,
            "end_date": end_date,
        }

        if offer_type == "plan":
            offer_data["plan"] = SubscriptionPlan.objects.get(id=item_id)
        else:
            offer_data["product"] = Product.objects.get(id=item_id)

        offer = Offer.objects.create(**offer_data)
        return offer

    def update(self, instance, validated_data):
        item_id = self.initial_data.get("item_id", instance.plan.id if instance.plan else instance.product.id)
        start_date = datetime.strptime(self.initial_data.get("start_date", instance.start_date.strftime("%Y-%m-%d")),
                                       "%Y-%m-%d").date()
        end_date = datetime.strptime(self.initial_data.get("end_date", instance.end_date.strftime("%Y-%m-%d")),
                                     "%Y-%m-%d").date()
        percentage = self.initial_data.get("percentage", instance.percentage)
        offer_type = self.initial_data.get("offer_type", instance.offer_type)

        instance.percentage = percentage
        instance.start_date = start_date
        instance.end_date = end_date

        if offer_type == "plan":
            instance.plan = SubscriptionPlan.objects.get(id=item_id)
        else:
            instance.product = Product.objects.get(id=item_id)

        instance.save()
        return instance
