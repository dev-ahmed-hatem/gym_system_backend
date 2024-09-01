from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
from users.serializers import EmployeeReadSerializer
from financials.models import FinancialItem, Transaction
from django.utils.timezone import now
from .models import *


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-plan-detail', lookup_field='pk')
    sub_type = serializers.SerializerMethodField()
    duration_display = serializers.SerializerMethodField()

    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

    def get_sub_type(self, obj):
        return obj.get_subscription_type_display()

    def get_duration_display(self, obj):
        if obj.is_duration:
            return f"{obj.days} {'يوم' if obj.days > 10 else 'أيام'}"
        else:
            return f"{obj.classes_no} {'حصة' if obj.classes_no > 10 else 'حصص'}"

    def validate(self, attrs):
        days = attrs.get('days')
        classes_no = attrs.get('classes_no')
        is_duration = attrs.get('is_duration')

        if is_duration and days is None:
            raise serializers.ValidationError({'days', 'duration is required'})

        if not is_duration and classes_no is None:
            raise serializers.ValidationError({'classes_no', 'classes number is required'})

        return attrs


class SubscriptionReadSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-detail', lookup_field='pk')
    plan = SubscriptionPlanSerializer()
    trainer = EmployeeReadSerializer()
    referrer = EmployeeReadSerializer()
    client_name = serializers.SerializerMethodField()
    client_id = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_is_expired(self, obj):
        return obj.is_expired()

    def get_client_name(self, obj):
        return obj.client.name

    def get_client_id(self, obj):
        return obj.client.id


class SubscriptionWriteSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-detail', lookup_field='pk')

    class Meta:
        model = Subscription
        fields = '__all__'

    def create(self, validated_data):
        subscription = super(SubscriptionWriteSerializer, self).create(validated_data)
        total_price = self.initial_data.get('total_price')

        # create transaction
        financial_item, _ = FinancialItem.objects.get_or_create(name="إيرادات اشتراكات", financial_type="incomes",
                                                                system_related=True)
        transaction = Transaction.objects.create(category=financial_item,
                                                 date=now().date(),
                                                 amount=total_price
                                                 )
        transaction.save()
        return subscription
