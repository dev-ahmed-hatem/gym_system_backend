from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
from .auth_views import CustomAsyncTokenObtainPairView, CustomAsyncTokenRefreshView
from users.views import get_authenticated_user

urlpatterns = [
    path('progym/', include([
        path('admin/', admin.site.urls),
        path('api/gym-data/', include('gym_data.urls')),
        path('api/users/', include('users.urls')),
        path('api/get_authenticated_user/', get_authenticated_user, name='get-authenticated-user'),
        path('api/subscriptions/', include('subscriptions.urls')),
        path('api/financials/', include('financials.urls')),
        path('api/clients/', include('clients.urls')),
        path('api/shop/', include('shop.urls')),
        path('api/reports/', include('reports.urls')),
        path('token/', CustomAsyncTokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', CustomAsyncTokenRefreshView.as_view(), name='token_refresh'),
        path('token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
        path('auth/', include('authentication.urls'))
    ]))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
