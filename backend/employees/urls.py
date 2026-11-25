from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('create/', views.create_employee, name="create_employee"),
    path('login/', views.employee_login, name="login_employee"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('logout/', views.employee_logout, name="logout_employee"),  
]
