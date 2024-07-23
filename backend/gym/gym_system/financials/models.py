from django.db import models
from users.models import Employee
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.timezone import datetime
from decimal import Decimal


class FinancialItem(models.Model):
    TYPE_CHOICES = (
        ('expenses', 'Expenses'),
        ('incomes', 'Incomes'),
    )

    name = models.CharField(max_length=100)
    financial_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

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
    private_percent = models.DecimalField(max_digits=2, decimal_places=2, default=0)
    subscription_percent = models.DecimalField(max_digits=2, decimal_places=2, default=0)
    bonuses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    got_advance = models.BooleanField(default=False)
    advance_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    advance_date = models.DateField(null=True, blank=True)
    vacations = models.IntegerField(default=0)
    working_hours = models.IntegerField(default=8)
    working_days = models.IntegerField(default=26)

    # subscriptions_list
    # private_list

    class Meta:
        unique_together = ('employee', 'month', 'year')
        verbose_name_plural = "Salaries"

    def __str__(self):
        return f"{self.employee} - {self.month} - {self.year}"

    def save(self, *args, **kwargs):
        self.got_advance = self.advance_payment > 0
        if not self.got_advance:
            self.advance_date = None
        return super().save(*args, **kwargs)

    @property
    def hourly_rate(self):
        return self.base_salary / (self.working_days * self.working_hours)

    @property
    def total_deductions(self):
        return self.deductions - self.extra_hours + self.vacations * self.working_hours

    @property
    def total_salary(self):
        total_salary = self.base_salary + self.bonuses - self.total_deductions * self.hourly_rate
        if self.got_advance:
            total_salary -= self.advance_payment
        return total_salary

    @property
    def available_advance(self):
        days = datetime.today().day
        current_salary = days * self.working_hours * self.hourly_rate
        current_salary = current_salary + self.bonuses - self.deductions * self.hourly_rate
        return current_salary * Decimal(0.4)
