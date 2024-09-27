from rest_framework.routers import DefaultRouter
from django.urls import path, include

from .views import *

router = DefaultRouter()
router.register('client', ClientViewSet, basename='client')
router.register("attendance", AttendanceViewSet, basename="attendance")

urlpatterns = [
    path('', include(router.urls)),
    path('scanner-code/', scanner_code, name='scanner-code'),
    path('scanner-mobile/', scanner_mobile, name='scanner-mobile'),
]
