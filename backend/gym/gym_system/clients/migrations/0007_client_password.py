# Generated by Django 5.0.6 on 2024-11-17 14:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0006_attendance_invitation_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='password',
            field=models.CharField(blank=True, default='unset', max_length=255, null=True),
        ),
    ]
