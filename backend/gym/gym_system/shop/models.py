from django.db import models
from clients.models import Client
from django.utils.timezone import now, localdate
from financials.models import FinancialItem, Transaction
from subscriptions.models import SubscriptionPlan


class ProductCategory(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Product Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    sell_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Sale(models.Model):
    STATE_CHOICES = (
        ('pending', 'معلق'),
        ('sold', 'تم البيع')
    )

    customer = models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    after_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    state = models.CharField(max_length=10, choices=STATE_CHOICES, default='pending')

    @property
    def total_quantity(self):
        return sum(item.amount for item in self.items.all())

    def confirm_sale(self):
        if self.state == 'pending':
            self.state = 'sold'
            self.confirmed_at = now()
            self.save()

            # create transaction
            financial_item, _ = FinancialItem.objects.get_or_create(name="إيرادات منتجات", financial_type="incomes",
                                                                    system_related=True)
            transaction = Transaction.objects.create(category=financial_item,
                                                     amount=self.total_price,
                                                     date=now().date(),
                                                     )
            transaction.save()
        else:
            return ValueError("تم تأكيد هذا الطلب بالفعل")

    def __str__(self):
        return f"order no: {self.id}"


class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField(default=1)

    @property
    def total_price(self):
        return self.product.sell_price * self.amount

    def __str__(self):
        return f"{self.product.name} -> {self.sale}"


class Offer(models.Model):
    OFFER_CHOICES = (
        ("product", "عرض على منتج"),
        ("plan", "عرض على اشتراك"),
    )

    offer_type = models.CharField(max_length=12, choices=OFFER_CHOICES)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()

    # Relations to either Product or plan
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        if self.product:
            return f"Offer on Product: {self.product.name}"
        elif self.plan:
            return f"Offer on Plan: {self.plan.name}"
        return "Offer"


    def is_active(self):
        return self.start_date <= localdate(now()) <= self.end_date
