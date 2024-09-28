from django.test import TestCase

# Create your tests here.
import json
from .models import SubscriptionPlan, Subscription
from clients.models import Client
from datetime import datetime


def rename_subs():
    file = open("clients_data/subscriptions.ini", "r", encoding="utf-8")
    data = json.load(file)
    out = open("clients_data/subscriptions.json", "w", encoding="utf-8")
    for sub in data:
        sub["sub_name"] = sub["sub_name"].replace("  ", " ").strip()
    json.dump(data, out)
    file.close()


def add_subs():
    file = open("clients_data/subscriptions.json", "r", encoding="utf-8")
    for sub in json.load(file):
        try:
            plan = SubscriptionPlan.objects.get(name=sub['sub_name'])
            start_date = datetime.strptime(sub['start_date'], "%Y/%m/%d").date()
            client = Client.objects.get(id=sub['client_id'])
            Subscription.objects.create(plan=plan, start_date=start_date, client=client)

        except SubscriptionPlan.DoesNotExist:
            print(f"{sub['sub_name']} not found")
    file.close()
