from django.db import models

# Create your models here.
class Clients(models.Model):
    client_name =  models.TextField(blank=False, null=False)
    cutomer_phoneNumber = models.CharField( max_length=17, null=False)
    client_phoneNumber_secoundary =models.CharField( max_length=17, null=True,blank=True)
    client_id = models.CharField(primary_key=True,max_length=10,unique=True)
    email = models.EmailField(unique=True) 
    Risk_Profile = [
        ("Conservative","Conservative") , 
        ("Moderate","Moderate"), 
        ("Aggresive","Aggresive")
    ]
    client_RiskProfile = models.CharField(max_length=20,choices=Risk_Profile,default="Conservative")
    ClientCategory = [
        ("Retail","Retail"),
        ("HNI","HNI"),
        ("Corporate","Corporate")
        ]
    client_category = models.CharField(max_length=50,choices=ClientCategory,default="Retail")
    Profile_value = models.CharField(max_length=50,default=None,null=True,blank=True)
    client_objective = models.TextField(blank=True,null=True)
    last_review_date = models.DateTimeField(null=True, blank=True)
    