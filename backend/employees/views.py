from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Employee
from .serializers import EmployeeSerializer
import json
# from models import Employee
from rest_framework import status



import json
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def employee_login(request):
    try:
        try:
            data = json.loads(request.body)
            username = data.get("employee_name")
            password = data.get("employee_password")

            if not username or not password:
                return Response(
                    {"message": "Username and password required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print("[employee_login]: unable to process request data")
            return Response(
                {"message": "Unable to process the request"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            employee = Employee.objects.get(employee_name=username)

        except Employee.DoesNotExist:
            return Response(
                {"message": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        except Employee.MultipleObjectsReturned:
            return Response(
                {"message": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        employee_password = employee.password

        if check_password(password, employee_password):
            return Response(
                {"message": "Login successful"},
                status=status.HTTP_200_OK
            )

        return Response(
            {"message": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    except Exception as e:
        print(f"[employee_login] Error: {e}")
        return Response(
            {"message": "Internal server error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def create_employee(request):
    """
    Create a new employee record using EmployeeSerializer.
    """
    try:
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            employee_obj = serializer.save()
            return Response(
                {
                    "message": "Employee created successfully",
                    "employee_ID": employee_obj.employee_ID,
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print("[create_employee error]:", e)
        return Response(
            {"error": "Internal server error. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
