from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register("subscription-plan", SubscriptionPlanViewSet, basename="subscription-plan")
router.register("subscription", SubscriptionViewSet, basename="subscription")

urlpatterns = [
    path("", include(router.urls)),
]
