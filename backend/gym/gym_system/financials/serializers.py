from rest_framework import serializers
from .models import *


class FinancialItemSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='financial-item-detail')

    class Meta:
        model = FinancialItem
        fields = '__all__'
