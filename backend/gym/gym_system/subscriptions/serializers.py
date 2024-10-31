from clients.models import Client
from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
from rest_framework.response import Response
from rest_framework import status
from users.serializers import EmployeeReadSerializer
from financials.models import FinancialItem, Transaction
from django.utils.timezone import now
from django.conf import settings
from .models import *
from cryptography.fernet import Fernet


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-plan-detail', lookup_field='pk')
    sub_type = serializers.SerializerMethodField()
    duration_display = serializers.SerializerMethodField()
    num_subscriptions = serializers.SerializerMethodField()

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

    def get_num_subscriptions(self, obj):
        if hasattr(obj, 'num_subscriptions'):
            return obj.num_subscriptions
        return None

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
    added_by = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_is_expired(self, obj):
        return obj.is_expired()

    def get_client_name(self, obj):
        return obj.client.name

    def get_client_id(self, obj):
        return obj.client.id

    def get_added_by(self, obj):
        if obj.added_by:
            return obj.added_by.name

    def get_created_at(self, obj):
        return f"{obj.created_at.astimezone(settings.CAIRO_TZ):%Y-%m-%d - %H:%M:%S}"


class SubscriptionWriteSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-detail', lookup_field='pk')

    class Meta:
        model = Subscription
        # fields = '__all__'
        exclude = ["client"]

    def validate(self, attrs):
        client_id = self.initial_data.get('client')
        client = Client.objects.get(id=client_id)
        plan = attrs.get('plan')
        start_date = attrs.get('start_date')
        same_subscription = Subscription.objects.filter(client=client,
                                                        plan=plan,
                                                        start_date=start_date
                                                        )
        if same_subscription.exists():
            raise serializers.ValidationError({"subscription_exists": "اشتراك موجود مسبقا"})
        return attrs

    def create(self, validated_data):
        # validated_data.pop('client')
        client_id = self.initial_data.get('client')
        client = Client.objects.get(id=client_id)
        user = self.context['request'].user
        subscription = Subscription.objects.create(**validated_data, client=client, added_by=user)
        total_price = self.initial_data.get('total_price')

        # create transaction
        financial_item, _ = FinancialItem.objects.get_or_create(name="إيرادات اشتراكات", financial_type="incomes",
                                                                system_related=True)
        transaction = Transaction.objects.create(category=financial_item,
                                                 date=now().astimezone(settings.CAIRO_TZ).date(),
                                                 amount=total_price
                                                 )
        subscription.transaction = transaction
        subscription.save()
        transaction.save()
        return subscription


class InvitationSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='invitation-detail', lookup_field='pk', read_only=True)
    is_valid = serializers.SerializerMethodField()
    key = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = '__all__'

    def get_is_valid(self, obj):
        return obj.is_valid()

    def get_key(self, obj):
        fernet = Fernet(settings.FERNET_KEY.encode())
        encrypted_key = fernet.encrypt(obj.code.encode())
        return encrypted_key.decode()
