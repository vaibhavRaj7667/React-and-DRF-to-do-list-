from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class RegisterView(APIView):
    def post(self,request):
        data = request.data
        serlizer = RegisterSerializer(data=data)
        if serlizer.is_valid():
            serlizer.save()
            return Response({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serlizer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)  # Logs in the user and creates a session
            return Response({"message": "Login successful!"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            

class Home(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)