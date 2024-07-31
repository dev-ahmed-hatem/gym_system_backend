import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_system.settings')

app = Celery('gym_system')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.beat_schedule = {
    'check_frozen_subscriptions': {
        'task': 'subscriptions.tasks.check_frozen_subscriptions_daily',
        'schedule': crontab(minute='0', hour='0'),
    },
}

# app.conf.timezone = 'Africa/Cairo'
# app.conf.broker_url = 'redis://localhost:6379/0'
# app.conf.result_backend = 'redis://localhost:6379/0'
