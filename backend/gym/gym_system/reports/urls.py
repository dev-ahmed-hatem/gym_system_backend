from .views import *
from django.urls import path, include

urlpatterns = [
    path("statistics/", statistics, name="statistics"),
]
