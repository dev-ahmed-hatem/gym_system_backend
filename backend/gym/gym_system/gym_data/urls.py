from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register('gym-data', GymDataViewSet, basename='gym-data')
router.register('link', LinkViewSet, basename='link')

urlpatterns = [
    path('', include(router.urls)),
]
