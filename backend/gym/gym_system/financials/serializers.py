from rest_framework import serializers
from .models import *
from users.serializers import EmployeeReadSerializer
from django.utils.timezone import datetime
from decimal import Decimal


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


class SalaryReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='salary-detail')
    hourly_rate = serializers.SerializerMethodField()
    total_salary = serializers.SerializerMethodField()
    total_deductions = serializers.SerializerMethodField()
    total_extra = serializers.SerializerMethodField()
    available_advance = serializers.SerializerMethodField()
    employee = EmployeeReadSerializer()
    referred_subscriptions = serializers.SerializerMethodField()
    private_trainings = serializers.SerializerMethodField()
    total_subscriptions_price = serializers.SerializerMethodField()
    total_trainings_price = serializers.SerializerMethodField()

    referred_subscriptions_net = serializers.SerializerMethodField()
    private_trainings_net = serializers.SerializerMethodField()

    class Meta:
        model = Salary
        fields = '__all__'

    def get_hourly_rate(self, obj):
        return obj.hourly_rate

    def get_total_salary(self, obj):
        return obj.total_salary

    def get_total_deductions(self, obj):
        return obj.total_deductions

    def get_total_extra(self, obj):
        return obj.total_extra

    def get_available_advance(self, obj):
        return obj.available_advance

    def get_referred_subscriptions(self, obj):
        return obj.referred_subscriptions

    def get_private_trainings(self, obj):
        return obj.private_trainings

    def get_total_subscriptions_price(self, obj):
        return sum(s["total_price"] for s in obj.referred_subscriptions)

    def get_total_trainings_price(self, obj):
        return sum(s["total_price"] for s in obj.private_trainings)

    def get_referred_subscriptions_net(self, obj):
        return obj.referred_subscriptions_net

    def get_private_trainings_net(self, obj):
        return obj.private_trainings_net


class SalaryWriteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='salary-detail')

    class Meta:
        model = Salary
        fields = '__all__'
