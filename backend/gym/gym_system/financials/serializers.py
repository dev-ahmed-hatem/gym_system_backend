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
    available_advance = serializers.SerializerMethodField()
    employee = EmployeeReadSerializer()

    class Meta:
        model = Salary
        fields = '__all__'

    def get_hourly_rate(self, obj):
        return obj.hourly_rate

    def get_total_salary(self, obj):
        return obj.total_salary

    def get_total_deductions(self, obj):
        return obj.total_deductions

    def get_available_advance(self, obj):
        return obj.available_advance


class SalaryWriteSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='salary-detail')

    class Meta:
        model = Salary
        fields = '__all__'

    def validate_advance_payment(self, data):
        if data > self.instance.available_advance:
            raise serializers.ValidationError({"advance_payment": "value more than available"})
        return data

    def update(self, instance, validated_data):
        advance_payment = validated_data.pop('advance_payment')
        got_advance = instance.got_advance
        if advance_payment > 0 and not got_advance:
            instance.advance_payment = Decimal(advance_payment)
            validated_data["advance_date"] = datetime.today().date()
            instance.save()
        elif advance_payment == 0:
            instance.advance_payment = Decimal(0)
            instance.save()
        return super().update(instance, validated_data)
