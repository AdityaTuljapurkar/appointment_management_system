from django.urls import path
from . import views 

urlpatterns = [
    path('', views.list_appointments, name="home"),
    path('create/', views.create_appointments, name="create_appointment"),

]

