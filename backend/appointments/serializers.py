from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    # Retrieve contact details directly through the client Foreign Key
    client_id = serializers.CharField(source='client.client_id', read_only=True)
    client_name = serializers.CharField(source='client.client_name', read_only=True)
    phone_number = serializers.CharField(source='client.cutomer_phoneNumber', read_only=True)
    secondary_phone = serializers.CharField(source='client.client_phoneNumber_secoundary', read_only=True)
    email = serializers.CharField(source='client.email', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'appointment_id',
            'client',
            'client_id',
            'client_name',
            'phone_number',
            'secondary_phone',
            'email',
            'appointment_date',
            'status',
            'assigned_to',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['appointment_id', 'created_at', 'updated_at']




