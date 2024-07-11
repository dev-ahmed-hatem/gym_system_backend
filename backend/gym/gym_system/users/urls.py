from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('employee', EmployeeViewSet)
router.register('nationality', NationalityViewSet)
router.register('marital-status', MaritalStatusViewSet)
router.register('employee-type', EmployeeTypeViewSet)
router.register('city', CityViewSet)
router.register('city-district', CityDistrictViewSet)
router.register('moderator', ModeratorViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
