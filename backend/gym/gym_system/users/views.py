from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from .serializers import *
from .models import *


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super(UserViewSet, self).get_queryset()

        search_query = self.request.query_params.get('search', None)

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(username__icontains=search_query) |
                Q(national_id__icontains=search_query) |
                Q(phone__icontains=search_query)
            )

        is_superuser_param = self.request.query_params.get('is_superuser', None)
        if is_superuser_param:
            if is_superuser_param.lower() == 'true':
                queryset = queryset.filter(is_superuser=True)

        return queryset


class EmployeeViewSet(ModelViewSet):
    queryset = Employee.objects.all()

    def get_queryset(self):
        queryset = super(EmployeeViewSet, self).get_queryset()
        search_query = self.request.query_params.get('search', None)

        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(phone__icontains=search_query) |
                Q(national_id__icontains=search_query)
            )

        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeWriteSerializer
        return EmployeeReadSerializer


class NationalityViewSet(ModelViewSet):
    queryset = Nationality.objects.all()
    serializer_class = NationalitySerializer


class MaritalStatusViewSet(ModelViewSet):
    queryset = MaritalStatus.objects.all()
    serializer_class = MaritalStatusSerializer


class EmployeeTypeViewSet(ModelViewSet):
    queryset = EmployeeType.objects.all()
    serializer_class = EmployeeTypeSerializer


class CityViewSet(ModelViewSet):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CityDistrictViewSet(ModelViewSet):
    queryset = CityDistrict.objects.all()
    serializer_class = CityDistrictSerializer


class ModeratorViewSet(ModelViewSet):
    queryset = Moderator.objects.all()
    serializer_class = ModeratorSerializer
