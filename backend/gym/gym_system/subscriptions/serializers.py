from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
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

    class Meta:
        model = Subscription
        fields = '__all__'


class SubscriptionWriteSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-detail', lookup_field='pk')

    class Meta:
        model = Subscription
        fields = '__all__'
