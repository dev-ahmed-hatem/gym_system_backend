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


class Transaction(models.Model):
    date = models.DateField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(FinancialItem, on_delete=models.CASCADE)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.category.name} - {self.date}"
