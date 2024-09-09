from django.db import models
from django.utils.timezone import timedelta
from datetime import datetime
from django.conf import settings


class SubscriptionPlan(models.Model):
    SUBSCRIPTION_TYPE_CHOICES = (
        ("main", "اشتراك أساسى"),
        ("sub", "اشتراك إضافى"),
        ("locker", "اشتراك لوكر"),
    )

    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    subscription_type = models.CharField(max_length=12, choices=SUBSCRIPTION_TYPE_CHOICES)
    description = models.TextField(default='', blank=True, null=True)
    freezable = models.BooleanField(default=False)
    freeze_no = models.IntegerField(default=7)
    invitations = models.IntegerField(default=0)
    for_students = models.BooleanField(default=False)
    validity = models.IntegerField(default=30)
    is_duration = models.BooleanField(default=True)
    classes_no = models.IntegerField(default=8, blank=True, null=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, related_name='subscriptions')
    trainer = models.ForeignKey('users.Employee', on_delete=models.SET_NULL, blank=True, null=True,
                                related_name='training')
    referrer = models.ForeignKey('users.Employee', on_delete=models.SET_NULL, blank=True, null=True,
                                 related_name='associated_subscriptions')
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    freeze_days_used = models.PositiveIntegerField(default=0)
    freeze_start_date = models.DateField(null=True, blank=True)
    is_frozen = models.BooleanField(default=False)
    unfreeze_date = models.DateField(null=True, blank=True)
    total_price = models.FloatField(default=0, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.plan.is_duration:
            self.end_date = self.start_date + timedelta(days=self.plan.days)
        else:
            self.end_date = self.start_date + timedelta(days=self.plan.validity)
        self.end_date += timedelta(days=self.freeze_days_used)
        return super(Subscription, self).save(*args, **kwargs)

    def freeze(self, freeze_date=None):
        if self.plan.freezable and self.freeze_days_used < self.plan.freeze_no:
            if not freeze_date:
                freeze_date = datetime.now().date()
            self.freeze_start_date = freeze_date
            self.is_frozen = True
            self.save()

    def check_freeze(self):
        if self.is_frozen:
            self.freeze_days_used += 1
            self.save()
        if self.freeze_days_used > self.plan.freeze_no:
            self.unfreeze()

    def unfreeze(self):
        if self.is_frozen:
            self.is_frozen = False
            self.unfreeze_date = datetime.now().date()
            self.save()

    def is_expired(self):
        return settings.CAIRO_TZ.localize(datetime.now()).date() > self.end_date

    @classmethod
    def get_active_subscriptions(cls):
        return cls.objects.filter(end_date__gte=settings.CAIRO_TZ.localize(datetime.now()).date())
