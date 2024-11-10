from django.db import models
from django.utils.timezone import now
from datetime import timedelta
from django.conf import settings
from django.db.models import Q, F


class SubscriptionPlan(models.Model):
    SUBSCRIPTION_TYPE_CHOICES = (
        ("main", "اشتراك أساسى"),
        ("sub", "اشتراك إضافى"),
        ("locker", "اشتراك لوكر"),
    )

    name = models.CharField(max_length=100)
    price = models.FloatField(default=0)
    days = models.IntegerField(default=30, null=True, blank=True)
    subscription_type = models.CharField(max_length=12, choices=SUBSCRIPTION_TYPE_CHOICES)
    description = models.TextField(default='', blank=True, null=True)
    freezable = models.BooleanField(default=False)
    freeze_no = models.IntegerField(default=7, null=True, blank=True)
    invitations = models.IntegerField(default=0)
    for_students = models.BooleanField(default=False)
    validity = models.IntegerField(default=30, null=True)
    is_duration = models.BooleanField(default=True)
    classes_no = models.IntegerField(default=8, blank=True, null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_duration:
            self.validity = self.days
        return super(SubscriptionPlan, self).save(*args, **kwargs)


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

    attendance_days = models.IntegerField(default=0, null=True, blank=True)
    invitations_used = models.IntegerField(default=0, null=True, blank=True)
    transaction = models.ForeignKey("financials.Transaction", on_delete=models.SET_NULL, blank=True, null=True, )

    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True, )

    def calculate_end_date(self):
        if self.plan.is_duration:
            end_date = self.start_date + timedelta(days=self.plan.days)
        else:
            end_date = self.start_date + timedelta(days=self.plan.validity)
        return end_date

    def save(self, *args, **kwargs):
        if not self.end_date:
            self.end_date = self.calculate_end_date()

        if self.transaction:
            self.transaction.amount = self.total_price
            self.transaction.save()
        return super(Subscription, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        if self.transaction:
            self.transaction.delete()
        super(Subscription, self).delete(using, keep_parents)

    def freeze(self, freeze_date=None):
        if self.plan.freezable and self.freeze_days_used < self.plan.freeze_no:
            if not self.freeze_start_date:
                self.freeze_start_date = freeze_date or now().astimezone(settings.CAIRO_TZ).date()
                self.is_frozen = True
                self.save()

    def check_freeze(self):
        print("checking")
        if self.is_frozen:
            self.freeze_days_used = (now().astimezone(settings.CAIRO_TZ).date() - self.freeze_start_date).days

            if self.freeze_days_used >= self.plan.freeze_no:
                self.unfreeze()
            else:
                self.save()

    def unfreeze(self):
        if self.is_frozen:
            self.is_frozen = False
            self.unfreeze_date = now().astimezone(settings.CAIRO_TZ).date()
            self.end_date += timedelta(days=self.freeze_days_used)
            self.save()

    def is_expired(self):
        time_expiration = now().astimezone(settings.CAIRO_TZ).date() > self.end_date
        classes_expiration = False
        if not self.plan.is_duration and self.attendance_days >= self.plan.classes_no:
            classes_expiration = True
        return classes_expiration or time_expiration

    @classmethod
    def get_active_subscriptions(cls):
        current_date = now().astimezone(settings.CAIRO_TZ).date()
        return cls.objects.filter(
            start_date__lte=current_date,
            end_date__gte=current_date).exclude(Q(plan__is_duration=False) &
                                                Q(attendance_days__gte=F('plan__classes_no')))


class Invitation(models.Model):
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    code = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return (not self.subscription.is_expired()
                and not self.is_used
                and self.subscription.invitations_used < self.subscription.plan.invitations)

    def save(self, *args, **kwargs):
        super(Invitation, self).save(*args, **kwargs)
        if not self.code and self.id:
            self.code = f"i-{self.id}"
            self.save()
