# backend/employees/admin.py
from django.contrib import admin
from .models import Employee

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_ID', 'employee_name', 'employee_phoneNumber', 'employee_email', 'role')
    list_filter = ('role',)  # <-- Filter sidebar by role
    search_fields = ('employee_ID', 'employee_name', 'employee_phoneNumber', 'employee_email')