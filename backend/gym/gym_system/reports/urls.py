from .views import *
from django.urls import path, include

urlpatterns = [
    path("statistics/", statistics, name="statistics"),
    path("daily-reports/", daily_reports, name="daily-reports"),
    path("duration-reports/", duration_reports, name="duration-reports"),
    path("birthdays/", birthdays, name="birthdays"),
]
