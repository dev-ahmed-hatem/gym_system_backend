from django.db import models
from clients.models import Client
from django.utils.timezone import now


class ProductCategory(models.Model):
    name = models.CharField(max_length=100)

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
