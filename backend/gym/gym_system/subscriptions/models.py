from django.db import models
from datetime import datetime, timedelta


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    invitaions = models.IntegerField(default=0)
    price = models.FloatField(default=0)
    description = models.TextField(default='', blank=True, null=True)
    for_students = models.BooleanField(default=False)
    validity = models.IntegerField(default=30)
    is_duration = models.BooleanField(default=True)
    duration = models.IntegerField(default=30, blank=True, null=True)
    classes_no = models.IntegerField(default=8, blank=True, null=True)
    freezable = models.BooleanField(default=False)
    freeze_no = models.IntegerField(default=7)

    def __str__(self):
        return self.name


class LockerPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    description = models.TextField(default='')
    freezable = models.BooleanField(default=False)
    freezable_no = models.IntegerField(default=7)

    def __str__(self):
        return self.name


class AdditionalPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    description = models.TextField(default='')

    def __str__(self):
        return self.name
