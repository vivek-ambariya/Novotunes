from django.urls import path
from .views import health_check, recommend

urlpatterns = [
    path('health/', health_check),
    path('recommendations/', recommend),
]
