from django.db import models


class FinancialItem(models.Model):
    TYPE_CHOICES = (
        ('expenses', 'Expenses'),
        ('incomes', 'Incomes'),
    )

    name = models.CharField(max_length=100)
    financial_type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    def __str__(self):
        return self.name
