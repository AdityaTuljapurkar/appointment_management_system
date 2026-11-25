from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view ,permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer
from clients.models import Clients
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAdminUser,
    IsAuthenticatedOrReadOnly
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointments(request):
    try:
        status_choice = request.data.get('status', 'unscheduled')
        client_id = request.data.get('client_id') or request.data.get('client')
        appointment_date = request.data.get('appointment_date')

        if not appointment_date:
            return Response(
                {"error": "appointment_date is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client_obj = None
        if client_id:
            try:
                client_obj = Clients.objects.get(client_id=client_id)
            except Clients.DoesNotExist:
                return Response(
                    {"error": f"Client with ID '{client_id}' does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Check for existing appointment at same date/time
        if client_obj:
            appointment_exist = Appointment.objects.filter(
                client=client_obj,
                appointment_date=appointment_date
            ).exists()
            if appointment_exist:
                return Response(
                    {"message": "An appointment already exists for this client at this time."},
                    status=status.HTTP_409_CONFLICT
                )

        appointment_obj = Appointment.objects.create(
            client=client_obj,
            status=status_choice,
            appointment_date=appointment_date
        )

        serializer = AppointmentSerializer(appointment_obj)
        return Response(
            {
                "message": "Appointment created successfully",
                "appointment_id": str(appointment_obj.appointment_id),
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        print("[create_appointments error]:", e)
        return Response(
            {"error": "Internal server error. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_appointments(request):
    try:
        # select_related('client') fetches the linked client details in a single SQL query
        appointments = Appointment.objects.select_related('client').all().order_by('-appointment_date')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Failed to fulfill get appointments request: {e}")
        return Response(
            {"error": "Failed to fetch appointments data"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

