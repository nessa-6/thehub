from django.urls import path, include
from .views import restricted, logout, getTokenView
from rest_framework import routers
from django.contrib.auth import views as auth_views
from rest_framework.authtoken import views

# router = routers.DefaultRouter()
# router.register(r'regusers', UserViewSet)
# router.register(r'logusers', loginUserView)


urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.authtoken')),
    path('restricted/', restricted),
]

