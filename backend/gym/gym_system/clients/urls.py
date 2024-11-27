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
    path('next-id/', get_next_client_id, name='next-id'),
    path('client-login/', ClientLogin.as_view(), name='client-login'),
    path('client-data/', GetClientData.as_view(), name='client-data'),
    path('client-latest-subscriptions/', ClientLatestSubscriptions.as_view(), name='client-latest-subscriptions'),

]
