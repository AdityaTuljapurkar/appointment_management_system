from django.contrib import admin
from .models import Clients
# Register your models here.
@admin.register(Clients)
class ClientsAdmin(admin.ModelAdmin):
    list_display = (
        "client_id",
        "client_name",
        "cutomer_phoneNumber",
        "client_phoneNumber_secoundary",
        "email",
        "client_RiskProfile",
        "client_category",
        "Profile_value",
        "client_objective",
        "last_review_date",
    )
    search_fields = ("client_id", "client_name", "cutomer_phoneNumber", "client_phoneNumber_secoundary")
    list_filter = ("client_RiskProfile", "client_category")