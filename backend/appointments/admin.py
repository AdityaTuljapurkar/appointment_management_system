from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "appointment_id",
        "client",
        "appointment_date",
        "status",
        "assigned_to",
    )
    list_filter = ("status", "appointment_date", "assigned_to")
    search_fields = ("appointment_id", "client__client_name", "client__client_id")
    readonly_fields = ("appointment_id", "created_at", "updated_at")



