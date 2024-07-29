from django.db import models
from django.utils.timezone import timedelta


class SubscriptionPlan(models.Model):
    SUBSCUBSCRIPTION_TYPE_CHOICES = (
        ("main", "اشتراك أساسى"),
        ("sub", "اشتراك إضافى"),
        ("locker", "اشتراك لوكر"),
    )

    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30)
    subscription_type = models.CharField(max_length=12, choices=SUBSCUBSCRIPTION_TYPE_CHOICES)
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

    def save(self, *args, **kwargs):
        if self.plan.is_duration:
            self.end_date = self.start_date + timedelta(days=self.plan.days)
        else:
            self.end_date = self.start_date + timedelta(days=self.plan.validity)
        return super(Subscription, self).save(*args, **kwargs)

    def freeze(self, freeze_date=None):
        if self.plan.freezable and self.freeze_days_used < self.plan.freeze_no:
            if not freeze_date:
                freeze_date = timezone.now().date()
            self.freeze_start_date = freeze_date
            self.is_frozen = True
            self.save()

    def unfreeze(self):
        if self.is_frozen:
            unfreeze_date = timezone.now().date()
            freeze_duration = (unfreeze_date - self.freeze_start_date).days
            self.freeze_days_used += freeze_duration
            self.end_date += freeze_duration
            self.freeze_start_date = None
            self.is_frozen = False
            self.unfreeze_date = unfreeze_date
            self.save()

    def get_active_days(self):
        # Calculate the active days, excluding the frozen days
        if self.is_frozen:
            freeze_duration = (timezone.now().date() - self.freeze_start_date).days
        else:
            freeze_duration = self.freeze_days_used

        active_duration = (self.end_date - self.start_date).days - freeze_duration
        return active_duration
