from django.db import models
from datetime import datetime, timedelta


class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    invitaions = models.IntegerField(default=0)
    price = models.FloatField(default=0)
    description = models.TextField(default='')
    for_students = models.BooleanField(default=False)
    validity = models.IntegerField(default=30)
    is_duration = models.BooleanField(default=True)
    duration = models.DateField(default=datetime.today() + timedelta(days=30))
    is_classes = models.BooleanField(default=False)
    classes_no = models.IntegerField(default=8)
    freezable = models.BooleanField(default=False)
    freezable_no = models.IntegerField(default=7)

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


class LockerNumber(models.Model):
    number = models.IntegerField()

    def __str__(self):
        return f"locker no: {self.number}"


class AdditionalPlan(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    description = models.TextField(default='')

    def __str__(self):
        return self.name
