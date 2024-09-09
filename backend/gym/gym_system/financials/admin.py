from django.contrib import admin
from .models import *

admin.site.register(FinancialItem)
admin.site.register(Transaction)
admin.site.register(Salary)
admin.site.register(Advance)
admin.site.register(AdvancePayment)
