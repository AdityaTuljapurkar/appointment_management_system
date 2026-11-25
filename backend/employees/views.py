from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.response import Response
from .models import Employee , User
from .serializers import EmployeeSerializer
import json
# from models import Employee
from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import json
from django.contrib.auth.hashers import check_password




@api_view(['POST'])
@permission_classes([AllowAny])
def employee_login(request):
    identifier = (
        request.data.get("employee_id") 
        or request.data.get('employee_email')
        or request.data.get('employee_name')
        or ''
    ).strip()

    password = request.data.get('password') or request.data.get('employee_password')
    if not identifier or not password:
        return Response(
            {'detail': 'Login identifier and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    if not User.objects.filter(username=identifier).exists():
        employees = Employee.objects.select_related('user').filter(
            Q(employee_ID__iexact=identifier)
            | Q(employee_email__iexact=identifier)
            | Q(employee_name__iexact=identifier)
        )
        if employees.count() != 1 or not employees.first().user:
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        target_user = employees.first().user
    else:
        target_user = User.objects.filter(username=identifier).first()

    if target_user and not target_user.is_active:
        return Response(
            {'detail': 'This account has been deactivated.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    user = authenticate(request, username=target_user.username, password=password)
    if user is None:
        return Response(
            {"detail": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    if not hasattr(user, "employee"):
        return Response(
            {"message": "No employee profile linked to this account"},
            status=status.HTTP_403_FORBIDDEN,
        )

    employee = user.employee
    refresh = RefreshToken.for_user(user)


    return Response(
        {
            "accessToken": str(refresh.access_token),
            "refreshToken": str(refresh),
            "employee": {
                "employee_ID": employee.employee_ID,
                "employee_name": employee.employee_name,
                "role": employee.role,
            },
        },
        status=status.HTTP_200_OK,
    )
    
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_employee(request):
    if not hasattr(request.user, 'employee') or request.user.employee.role != 'Admin':
        return Response(
            {"error": "Only Admin can register new employees."},
            status=status.HTTP_403_FORBIDDEN,
        )
    try : 
        employee_email = (request.data.get('employee_email')or'').strip()
        if employee_email and Employee.objects.filter(employee_email=employee_email).exists():
            return Response(
                {"error": "An employee with this email already exists."},
                status=status.HTTP_409_CONFLICT,
            )
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def employee_logout(request):
    refresh_token = request.data.get("refreshToken") or request.data.get("refresh")
    if not refresh_token:
        return Response(
            {"detail": "Refresh token is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"[employee_login] error : {e} ")
        return Response(
            {"detail": "Invalid or expired refresh token."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    