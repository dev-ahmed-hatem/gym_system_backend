from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from subscriptions.models import Subscription


# Async function to update frozen subscriptions
def update_frozen_subscriptions():
    frozen_subscriptions = Subscription.objects.filter(is_frozen=True)
    for subscription in frozen_subscriptions:
        subscription.check_freeze()


# Custom async token obtain view
class CustomAsyncTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            update_frozen_subscriptions()

        return response


# Custom async token refresh view
class CustomAsyncTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            update_frozen_subscriptions()

        return response
