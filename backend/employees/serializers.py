from rest_framework import serializers
from .models import Employee
from django.contrib.auth.models import User
from django.db import transaction
from .models import Employee , generate_emp_id

class EmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = Employee
        fields = [
            'employee_ID',
            'employee_name',
            'employee_phoneNumber',
            'employee_email',
            'role',
            'password',
        ]
        read_only_fields = ['employee_ID']

    @transaction.atomic
    def create(self, data):
        raw_password = data.pop('password')
        emp_id = generate_emp_id()
        role = data.get('role', 'Advisor')

        is_active = True
        is_staff = (role == 'Admin')

        user = User.objects.create_user(
            username=emp_id,
            password=raw_password,
            is_active=is_active,
            is_staff=is_staff,
            is_superuser=False,
        )

        employee = Employee.objects.create(
            user=user,
            employee_ID=emp_id,
            password=user.password,
            **data,
        )
        return employee