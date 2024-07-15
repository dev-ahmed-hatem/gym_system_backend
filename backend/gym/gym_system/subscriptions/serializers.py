from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField
from .models import *


class SubscriptionPlanSerializer(serializers.ModelSerializer):
    url = HyperlinkedIdentityField(view_name='subscription-plan-detail', lookup_field='pk')

    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

    def validate(self, attrs):
        duration = attrs.get('duration')
        classes_no = attrs.get('classes_no')
        is_duration = attrs.get('is_duration')

        if is_duration and duration is None:
            raise serializers.ValidationError({'duration', 'duration is required'})

        if not is_duration and classes_no is None:
            raise serializers.ValidationError({'classes_no', 'classes number is required'})

        return attrs


class LockerPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = LockerPlan
        fields = '__all__'


class AdditionalPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalPlan
        fields = '__all__'
