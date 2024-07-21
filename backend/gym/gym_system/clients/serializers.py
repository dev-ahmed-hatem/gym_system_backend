from django.utils import timezone
from rest_framework import serializers
from .models import *
from subscriptions.models import SubscriptionPlan
from subscriptions.serializers import SubscriptionPlanSerializer
from users.serializers import EmployeeReadSerializer, UserSerializer
from django.conf import settings


class SubscriptionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='subscription-detail')
    plan = SubscriptionPlanSerializer()
    is_current = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = '__all__'

    def get_is_current(self, obj):
        if obj.end_date:
            return obj.is_current
        else:
            return None


class ClientReadSerializer(serializers.ModelSerializer):
    trainer = EmployeeReadSerializer()
    added_by = UserSerializer()
    current_subscription = SubscriptionSerializer()
    subscription_history = SubscriptionSerializer(many=True)
    url = serializers.HyperlinkedIdentityField(view_name='client-detail')
    qr_code = serializers.SerializerMethodField(read_only=True)
    barcode = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

    def get_qr_code(self, obj):
        qr_code = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.qr_code}")
        return qr_code

    def get_barcode(self, obj):
        barcode = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.barcode}")
        return barcode


class ClientWriteSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.CharField(write_only=True, required=False)
    start_date = serializers.CharField(write_only=True, required=False)
    qr_code = serializers.CharField(read_only=True)
    barcode = serializers.CharField(read_only=True)

    class Meta:
        model = Client
        fields = '__all__'

    def create(self, validated_data):
        subscription_plan = validated_data.pop('subscription_plan', None)
        subscription_history = validated_data.pop('subscription_history', None)
        start_date = validated_data.pop('start_date', None)
        client = super().create(validated_data)
        if subscription_plan:
            plan = SubscriptionPlan.objects.get(id=subscription_plan)
            # assign start date
            if start_date:
                start_date = timezone.make_aware(timezone.datetime.strptime(start_date, '%Y-%m-%d'),
                                                 timezone.get_current_timezone())
            else:
                start_date = timezone.now()

            # assign end date
            if plan.is_duration:
                end_date = start_date + timezone.timedelta(days=plan.days)
            else:
                end_date = start_date + timezone.timedelta(days=plan.validity)
            client_sub = Subscription.objects.create(plan=plan,
                                                     client=client,
                                                     start_date=start_date,
                                                     end_date=end_date)
            client_sub.save()
            client.current_subscription = client_sub
            client.subscription_history.add(client_sub)
            client.save()

        return client
