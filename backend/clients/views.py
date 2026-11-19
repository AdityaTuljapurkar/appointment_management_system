from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Clients
from .serializers import ClientSerializer


@api_view(['GET'])
def list_clients(request):
    try:
        queryset = Clients.objects.all().order_by('client_name')
        serializer = ClientSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print("[DB Client] Failed to process data:", e)
        return Response(
            {"error": "Failed to fetch clients data"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
@api_view(['POST'])
def create_client(request):
    try:
        client_id = request.data.get('client_id')
        client_name = request.data.get('client_name')
        cutomer_phoneNumber = request.data.get('cutomer_phoneNumber')
        client_phoneNumber_secoundary = request.data.get('client_phoneNumber_secoundary', None) # <-- 2nd phone number (optional)
        email = request.data.get('email')
        client_RiskProfile = request.data.get('client_RiskProfile', 'Conservative')
        client_category = request.data.get('client_category', 'Retail')
        Profile_value = request.data.get('Profile_value', None)
        client_objective = request.data.get('client_objective', '')
        last_review_date = request.data.get('last_review_date', None)

        # Check required fields (2nd phone number is NOT required)
        if not client_id or not client_name or not cutomer_phoneNumber or not email:
            return Response(
                {"error": "client_id, client_name, primary phone number, and email are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

     
        if Clients.objects.filter(client_id=client_id).exists():
            return Response(
                {"error": f"Client with ID '{client_id}' already exists."},
                status=status.HTTP_409_CONFLICT,
            )

        if Clients.objects.filter(email=email).exists():
            return Response(
                {"error": "A client with this email already exists."},
                status=status.HTTP_409_CONFLICT,
            )
        if Clients.objects.filter(cutomer_phoneNumber=cutomer_phoneNumber).exists():
                    return Response(
                        {"error": "A client with this Phonenumber already exists."},
                        status=status.HTTP_409_CONFLICT,
                    )

        
        client_obj = Clients.objects.create(
            client_id=client_id,
            client_name=client_name,
            cutomer_phoneNumber=cutomer_phoneNumber,
            client_phoneNumber_secoundary=client_phoneNumber_secoundary,
            email=email,
            client_RiskProfile=client_RiskProfile,
            client_category=client_category,
            Profile_value=Profile_value,
            client_objective=client_objective,
            last_review_date=last_review_date,
        )

        return Response(
            {
                "message": "Client created successfully",
                "client_id": client_obj.client_id,
            },
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print("[create_client error]:", e)
        return Response(
            {"error": "Internal server error. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


