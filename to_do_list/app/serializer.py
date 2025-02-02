from rest_framework import serializers
from django.contrib.auth.models import User
from .models import task

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    # write_only=True: Ensures the password is only used for input (write) and will not be returned in the API response.

    class Meta:
        model = User
        fields =['username','email','password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        return user
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = task
        fields = ['id','details']




        