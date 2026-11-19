from django.db import models
from django.contrib.auth.models import User

import secrets

def generate_appointment_id():
    return f"APT-{secrets.token_hex(6)}"


class Appointment(models.Model):
    STATUS_CHOICES = [
        ('unscheduled', 'Unscheduled'),
        ('scheduled', 'Scheduled'),
        ('rescheduled', 'Rescheduled'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    # Custom Primary Key
    appointment_id = models.CharField(
        primary_key=True,
        max_length=20,
        default=generate_appointment_id,  # No parentheses ()
        editable=False,
    )

    # Foreign Key to Clients
    client = models.ForeignKey(
        'clients.Clients',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments'
    )

   
    appointment_date = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='unscheduled'
    )

    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        default=None,
        related_name='appointments'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)