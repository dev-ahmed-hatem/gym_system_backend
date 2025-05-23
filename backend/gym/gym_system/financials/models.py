from django.db import models
from users.models import Employee
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
from subscriptions.models import Subscription
from django.utils.timezone import now
from django.conf import settings


def current_date():
    return now().astimezone(settings.CAIRO_TZ).date()


class FinancialItem(models.Model):
    TYPE_CHOICES = (
        ('expenses', 'Expenses'),
        ('incomes', 'Incomes'),
    )

    name = models.CharField(max_length=100)
    financial_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    # specify whether the instance is created by system
    system_related = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Transaction(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(FinancialItem, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.category.name} - {self.date}"


class Salary(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    month = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])
    year = models.IntegerField()
    base_salary = models.DecimalField(max_digits=10, decimal_places=2, default=10000)
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    extra_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    private_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subscription_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    vacations = models.IntegerField(default=0)
    working_hours = models.IntegerField(default=8)
    working_days = models.IntegerField(default=26)

    class Meta:
        unique_together = ('employee', 'month', 'year')
        verbose_name_plural = "Salaries"

    def __str__(self):
        return f"{self.employee} - {self.month} - {self.year}"

    @property
    def hourly_rate(self):
        return self.base_salary / (self.working_days * self.working_hours)

    @property
    def total_deductions(self):
        return (self.deductions + self.vacations * self.working_hours) * self.hourly_rate

    @property
    def total_extra(self):
        return self.bonuses + self.extra_hours * self.hourly_rate

    @property
    def referred_subscriptions(self):
        subscriptions = Subscription.objects.filter(referrer=self.employee.id, start_date__month=self.month,
                                                    start_date__year=self.year)
        referred_subscriptions = []
        for sub in subscriptions:
            referred_subscriptions.append({
                "id": sub.id,
                "sub_name": sub.plan.name,
                "start_date": sub.start_date,
                "total_price": sub.total_price
            })
        return referred_subscriptions

    @property
    def private_trainings(self):
        subscriptions = Subscription.objects.filter(trainer=self.employee.id, start_date__month=self.month,
                                                    start_date__year=self.year)
        private_trainings = []
        for sub in subscriptions:
            private_trainings.append({
                "id": sub.id,
                "sub_name": sub.plan.name,
                "start_date": sub.start_date,
                "total_price": sub.total_price
            })
        return private_trainings

    @property
    def referred_subscriptions_net(self):
        total_subscription_price = sum(s["total_price"] for s in self.referred_subscriptions)
        return Decimal(total_subscription_price) * self.subscription_percent / 100

    @property
    def private_trainings_net(self):
        total_trainings_price = sum(s["total_price"] for s in self.private_trainings)
        return Decimal(total_trainings_price) * self.private_percent / 100

    @property
    def total_salary(self):
        total_salary = self.base_salary + self.total_extra - self.total_deductions
        total_salary += self.referred_subscriptions_net + self.private_trainings_net
        return total_salary

    @property
    def available_advance(self):
        return self.base_salary * Decimal(0.5)


class Advance(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='advances')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=current_date)
    total_repaid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fully_paid = models.BooleanField(default=False)

    class Meta:
        ordering = ["fully_paid"]

    def __str__(self):
        return f"Advance of {self.amount} for {self.employee.name}"

    def remaining_balance(self):
        return self.amount - self.total_repaid

    def check_fully_paid(self):
        if self.remaining_balance() <= 0:
            self.fully_paid = True
            self.save()


class AdvancePayment(models.Model):
    advance = models.ForeignKey(Advance, on_delete=models.CASCADE, related_name='payments')
    date = models.DateField(default=current_date)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Payment of {self.amount} on {self.payment_date}"

    def save(self, *args, **kwargs):
        self.advance.total_repaid += self.amount
        self.advance.check_fully_paid()
        self.advance.save()
        super().save(*args, **kwargs)
