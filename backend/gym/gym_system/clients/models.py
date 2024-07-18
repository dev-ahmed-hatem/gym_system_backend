from django.db import models
from django.utils.timezone import datetime, now


class Subscription(models.Model):
    plan = models.ForeignKey('subscriptions.SubscriptionPlan', on_delete=models.CASCADE, null=True)
    client = models.ForeignKey('clients.Client', on_delete=models.CASCADE, null=True)
    start_date = models.DateField(default=now)
    end_date = models.DateField(blank=True, null=True)

    is_active = models.BooleanField(default=True)

    @property
    def is_current(self):
        return self.end_date >= datetime.now()

    def __str__(self):
        return f"{self.client.name} - {self.plan.name}"


class Client(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]

    name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=20, unique=True)
    gander = models.CharField(max_length=6, choices=GENDER_CHOICES, default='male')
    birth_date = models.DateField(blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    phone = models.CharField(max_length=15)
    phone2 = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='photos/', blank=True, null=True)
    added_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, default=1)

    trainer = models.ForeignKey('users.Employee', on_delete=models.SET_NULL, blank=True, null=True)
    current_subscription = models.OneToOneField(Subscription, on_delete=models.SET_NULL, blank=True, null=True,
                                                related_name='current_subscription')
    subscription_history = models.ManyToManyField(Subscription, blank=True,
                                                  related_name='subscription_history')
    is_blocked = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
