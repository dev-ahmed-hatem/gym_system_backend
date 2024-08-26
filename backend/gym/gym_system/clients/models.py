from django.db import models
from datetime import date
from django.utils.timezone import now
from django.conf import settings
import qrcode
from barcode import get_barcode_class, writer
from io import BytesIO
from django.core.files.base import File
from cryptography.fernet import Fernet
from subscriptions.models import Subscription


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
    added_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes', blank=True, null=True)
    barcode = models.ImageField(upload_to='barcodes', blank=True, null=True)
    is_blocked = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        if self.qr_code:
            if os.path.isfile(self.qr_code.path):
                os.remove(self.qr_code.path)
        if self.barcode:
            if os.path.isfile(self.barcode.path):
                os.remove(self.barcode.path)
        super().delete(*args, **kwargs)

    def generate_qr_code(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(self.encrypt_id)
        qr.make(fit=True)
        img = qr.make_image(fill='black', back_color='white')

        buffer = BytesIO()
        img.save(buffer, 'png')
        self.qr_code.save(f"{self.id}_{self.name}_qr.png", File(buffer), save=False)
        buffer.close()

    def generate_barcode(self):
        barcode_class = get_barcode_class('code128')
        img = barcode_class(str(self.id).zfill(5), writer=writer.ImageWriter())

        buffer = BytesIO()
        img.write(buffer)
        self.barcode.save(f"{self.id}_{self.name}_bar.png", File(buffer), save=False)
        buffer.close()

    @property
    def encrypt_id(self):
        fernet = Fernet(settings.FERNET_KEY.encode())
        encrypted_data = fernet.encrypt(str(self.id).encode())
        return encrypted_data.decode()

    @property
    def decrypt_id(self):
        fernet = Fernet(settings.FERNET_KEY.encode())
        decrypted_data = fernet.decrypt(self.encrypt_id.encode())
        return decrypted_data.decode()


class Attendance(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
