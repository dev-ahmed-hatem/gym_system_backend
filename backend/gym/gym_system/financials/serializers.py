from rest_framework import serializers
from .models import *


class FinancialItemSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='financial-item-detail')

    class Meta:
        model = FinancialItem
        fields = '__all__'


class TransactionReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='transaction-detail')
    category = FinancialItemSerializer()

    class Meta:
        model = Transaction
        fields = '__all__'


class TransactionWriteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='transaction-detail')

    class Meta:
        model = Transaction
        fields = '__all__'
