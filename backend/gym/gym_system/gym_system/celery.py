import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_system.settings')

# Create a Celery instance and set its name to match the project name
app = Celery('gym_system')

# Configure Celery using Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'print_hello_world': {
        'task': 'financials.tasks.print_hello',  # Ensure this task path is correct
        'schedule': 12.0,
    },
}

# app.conf.timezone = 'Africa/Cairo'

app.conf.broker_url = 'redis://localhost:6379/0'

# Optionally, you can also use Redis as the result backend
app.conf.result_backend = 'redis://localhost:6379/0'