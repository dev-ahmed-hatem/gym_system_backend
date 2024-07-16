from django.db import models
from datetime import datetime, timedelta


class BaseSubscriptions(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    description = models.TextField(default='', blank=True, null=True)
    freezable = models.BooleanField(default=False)
    freeze_no = models.IntegerField(default=7)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class SubscriptionPlan(BaseSubscriptions):
    invitations = models.IntegerField(default=0)
    for_students = models.BooleanField(default=False)
    validity = models.IntegerField(default=30)
    is_duration = models.BooleanField(default=True)
    classes_no = models.IntegerField(default=8, blank=True, null=True)


class LockerPlan(BaseSubscriptions):
    pass


class AdditionalPlan(BaseSubscriptions):
    pass
