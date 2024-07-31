from celery import shared_task
from django.core.management import call_command


@shared_task
def check_frozen_subscriptions_daily():
    call_command("subscriptions_tasks")
