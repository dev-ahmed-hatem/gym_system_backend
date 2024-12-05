from datetime import datetime
import qrcode
import os
from django.db import models
from django.conf import settings
from barcode import get_barcode_class, writer
from io import BytesIO
from django.core.files.base import File
from django.utils import timezone
from cryptography.fernet import Fernet
from subscriptions.models import Subscription
from django.contrib.auth.hashers import make_password, check_password


def client_photo_upload_path(instance, filename):
    # Define the file name format
    extension = os.path.splitext(filename)[1]  # Get file extension
    return f"photos/photo_{instance.id or 'temp'}{extension}"


class Client(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    custom_pk = models.AutoField(primary_key=True)

    id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=100)
    national_id = models.CharField(max_length=14, blank=True, null=True)
    gander = models.CharField(max_length=6, choices=GENDER_CHOICES, default='male')
    birth_date = models.DateField(blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True, default=0)
    phone = models.CharField(max_length=15, unique=True)
    phone2 = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to=client_photo_upload_path, blank=True, null=True)
    requested_photo = models.ImageField(upload_to='requested/', blank=True, null=True)
    added_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    qr_code = models.ImageField(upload_to='qr_codes', blank=True, null=True)
    barcode = models.ImageField(upload_to='barcodes', blank=True, null=True)
    is_blocked = models.BooleanField(default=False)
    password = models.CharField(max_length=255, blank=True, null=True, default="unset")
    weight = models.FloatField(blank=True, null=True)
    height = models.FloatField(blank=True, null=True)

    def set_password(self, password):
        self.password = make_password(password)

    def check_password(self, password):
        if self.password == "unset":
            return password == self.phone
        return check_password(password, self.password)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def calculate_age(self):
        if self.birth_date:
            today = datetime.now().astimezone(settings.CAIRO_TZ).date()
            age = today.year - self.birth_date.year

            month_diff = today.month - self.birth_date.month
            day_diff = today.day - self.birth_date.day

            if month_diff < 0 or (month_diff == 0 and day_diff < 0):
                age -= 1
            self.age = max(age, 0)

    def save(self, *args, **kwargs):
        self.calculate_age()

        initial_save = not self.id
        super(Client, self).save(*args, **kwargs)

        if initial_save:
            if not self.qr_code:
                self.qr_code = self.id
                # self.generate_qr_code()
            if not self.barcode:
                self.barcode = self.id
                # self.generate_barcode()

            super(Client, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # if self.qr_code:
        #     if os.path.isfile(self.qr_code.path):
        #         os.remove(self.qr_code.path)
        # if self.barcode:
        #     if os.path.isfile(self.barcode.path):
        #         os.remove(self.barcode.path)
        if self.photo:
            self.photo.delete(save=False)
        if self.requested_photo:
            self.requested_photo.delete(save=False)
        super().delete(*args, **kwargs)

    def delete_requested_photo(self):
        if self.requested_photo:
            self.requested_photo.delete()
            self.requested_photo = None
            self.save()

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
        self.qr_code.save(f"client_{self.id}_qr.png", File(buffer), save=False)
        buffer.close()

    def generate_barcode(self):
        barcode_class = get_barcode_class('code128')
        img = barcode_class(str(self.id).zfill(5), writer=writer.ImageWriter())

        buffer = BytesIO()
        img.write(buffer)
        self.barcode.save(f"client_{self.id}_bar.png", File(buffer), save=False)
        buffer.close()

    @property
    def encrypt_id(self):
        fernet = Fernet(settings.FERNET_KEY.encode())
        encrypted_data = fernet.encrypt(str(self.id).encode())
        return encrypted_data.decode()

    def check_id(self, encrypted_id):
        try:
            fernet = Fernet(settings.FERNET_KEY.encode())
            decrypted_data = fernet.decrypt(str(encrypted_id))
            return self.id == str(decrypted_data.decode())
        except:
            return False


class Attendance(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, blank=True, null=True)
    guest = models.CharField(max_length=100, blank=True, null=True)
    invitation_code = models.CharField(max_length=100, blank=True, null=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)


def get_today():
    return datetime.now(settings.CAIRO_TZ).today()


class New(models.Model):
    title = models.CharField(max_length=100, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    created_at = models.DateField(default=get_today)
    picture = models.ImageField(upload_to='news/', blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
