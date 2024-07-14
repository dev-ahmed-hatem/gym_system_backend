from rest_framework import serializers
from rest_framework.relations import HyperlinkedIdentityField

from .models import *


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    url = HyperlinkedIdentityField(view_name='user-detail', lookup_field='pk')

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'phone', 'national_id', 'is_superuser', 'is_moderator', 'password',
                  'password2', 'url']

    def validate(self, data):
        if 'password' in data and 'password2' in data:
            if data['password'] != data['password2']:
                raise serializers.ValidationError(
                    {'password': 'passwords do not match', 'password2': 'passwords do not match'})

        return data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2')
        is_superuser = validated_data.pop('is_superuser', False)

        user = super().create(validated_data)

        if is_superuser:
            user.is_superuser = is_superuser
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        password2 = validated_data.pop('password2', None)
        user = super().update(instance, validated_data)

        user.set_password(password)
        user.save()
        return user


class NationalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationality
        fields = '__all__'


class MaritalStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaritalStatus
        fields = '__all__'


class EmployeeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeType
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class CityDistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityDistrict
        fields = '__all__'


class ModeratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Moderator
        fields = '__all__'


class EmployeeReadSerializer(serializers.ModelSerializer):
    nationality = NationalitySerializer()
    marital_status = MaritalStatusSerializer()
    city = CitySerializer()
    district = CityDistrictSerializer()
    added_by = UserSerializer()
    emp_type = EmployeeTypeSerializer()
    url = HyperlinkedIdentityField(view_name='employee-detail', lookup_field='pk')

    class Meta:
        model = Employee
        fields = '__all__'


class EmployeeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

    # def create(self, validated_data):
        # print(validated_data.get("gander"))