from django.core.management.base import BaseCommand
from subscriptions.models import Subscription


class Command(BaseCommand):
    help = 'Check frozen subscriptions and update dates'

    def handle(self, *args, **options):
        for subscription in Subscription.get_active_subscriptions():
            subscription.check_freeze()
