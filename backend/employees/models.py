from django.contrib.auth.models import User
from django.db import models
import secrets

def generate_emp_id():
    return f"EMP-{secrets.token_hex(6)}"


class Employee(models.Model):

    ROLE_CHOICES = [
        ('Advisor', 'Financial Advisor'),
        ('Relationship Manager', 'Relationship Manager'),
        ('Coordinator', 'Coordinator'),
        ('Admin', 'Admin / Manager'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='employee',
        null=True,
        blank=True,
    )

    employee_ID = models.CharField(
        primary_key=True,
        max_length=20,
        default=generate_emp_id,
        editable=False
    )

    employee_name = models.CharField(max_length=100)
    employee_phoneNumber = models.CharField(max_length=17)
    employee_email = models.EmailField(max_length=254)

    role = models.CharField(
        max_length=30,
        choices=ROLE_CHOICES,
        default='Advisor'
    )

    # Kept temporarily for data migration; we will remove this in Step 4
    password = models.TextField()

    def __str__(self):
        return f"{self.employee_name} ({self.employee_ID}) - {self.role}"