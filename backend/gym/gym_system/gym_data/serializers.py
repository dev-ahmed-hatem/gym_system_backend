from rest_framework import serializers
from .models import *


class GymDataSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='gym-data-detail')
    class Meta:
        model = GymData
        fields = '__all__'


class LinkSerializer(serializers.ModelSerializer):
    api_url = serializers.HyperlinkedIdentityField(view_name='link-detail', read_only=True)

    class Meta:
        model = Link
        fields = '__all__'
