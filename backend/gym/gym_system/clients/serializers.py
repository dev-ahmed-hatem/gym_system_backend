from django.utils.timezone import datetime
from rest_framework import serializers
from .models import *
from subscriptions.models import SubscriptionPlan, Subscription
from subscriptions.serializers import SubscriptionReadSerializer
from users.models import Employee
from users.serializers import UserSerializer
from django.conf import settings


class ClientReadSerializer(serializers.ModelSerializer):
    added_by = UserSerializer()
    url = serializers.HyperlinkedIdentityField(view_name='client-detail')
    qr_code = serializers.SerializerMethodField(read_only=True)
    barcode = serializers.SerializerMethodField(read_only=True)
    subscriptions = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = '__all__'

    def get_qr_code(self, obj):
        qr_code = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.qr_code}")
        return qr_code

    def get_barcode(self, obj):
        barcode = self.context['request'].build_absolute_uri(f"{settings.MEDIA_URL}{obj.barcode}")
        return barcode

    def get_subscriptions(self, obj):
        from subscriptions.serializers import SubscriptionReadSerializer
        subscriptions = obj.subscriptions.all().order_by('-start_date')
        return SubscriptionReadSerializer(subscriptions, many=True,
                                          context={'request': self.context.get('request')}).data


class ClientWriteSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.CharField(write_only=True, required=False)
    start_date = serializers.CharField(write_only=True, required=False)
    qr_code = serializers.CharField(read_only=True)
    barcode = serializers.CharField(read_only=True)
    trainer = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Client
        fields = '__all__'

    def create(self, validated_data):
        subscription_plan = validated_data.pop('subscription_plan', None)
        trainer = validated_data.pop('trainer', None)
        start_date = validated_data.pop('start_date', None)
        client = super().create(validated_data)
        if not client.qr_code:
            client.generate_qr_code()
        if not client.barcode:
            client.generate_barcode()

        trainer = Employee.objects.get(pk=trainer) if trainer else None
        if subscription_plan:
            plan = SubscriptionPlan.objects.get(id=subscription_plan)
            if start_date:
                start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            else:
                start_date = datetime.now().date()

            client_sub = Subscription.objects.create(plan=plan,
                                                     client=client,
                                                     start_date=start_date,
                                                     trainer=trainer)
            client_sub.save()
        client.save()

        return client
