from django.utils import timezone
from rest_framework import serializers
from .models import *
from subscriptions.models import SubscriptionPlan
from users.serializers import EmployeeReadSerializer


class ClientReadSerializer(serializers.ModelSerializer):
    trainer = EmployeeReadSerializer()
    url = serializers.HyperlinkedIdentityField(view_name='client-detail')

    class Meta:
        model = Client
        fields = '__all__'



class ClientWriteSerializer(serializers.ModelSerializer):
    subscription_plan = serializers.CharField(write_only=True, required=False)
    start_date = serializers.CharField(write_only=True, required=False)

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


class SubscriptionSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='subscription-detail')

    class Meta:
        model = Subscription
        fields = '__all__'
