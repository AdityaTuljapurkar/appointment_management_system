from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'employee_ID',
            'employee_name',
            'employee_phoneNumber',
            'employee_email',
            'role',
        ]
        read_only_fields = ['employee_ID']

        