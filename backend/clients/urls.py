from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_clients, name="list_clients"),
    path('create/', views.create_client, name="create_client"),
]
