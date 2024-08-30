from django.db import models


class Link(models.Model):
    title = models.CharField(max_length=100)
    url = models.URLField()
    icon = models.ImageField(upload_to='gym_data/', null=True, blank=True)


class GymData(models.Model):
    title = models.CharField(max_length=255, default="GYM")
    logo = models.ImageField(upload_to='gym_data/', null=True, blank=True)
    address = models.CharField(max_length=255, null=True, blank=True)
    telephone = models.CharField(max_length=255, null=True, blank=True)
