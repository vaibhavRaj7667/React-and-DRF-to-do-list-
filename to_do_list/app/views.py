from django.shortcuts import render
from rest_framework.views import APIView
from .serializer import *
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import JSONParser
from django.http import HttpResponse, JsonResponse


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
    

class ProtectedView(APIView):
    def get(self, request):
        current_user = request.user
        return Response({'user':current_user.username})

            

class Home(APIView):

    def get(self, request):
        content = {'message': 'Hello, World!'}
        return Response(content)
    

class Task(APIView):

    def post(self, request):
        
        serializer = ProductSerializer(data = request.data)
        if serializer.is_valid():

            serializer.save()
            return JsonResponse(serializer.data,status=200)
        else:
            return JsonResponse(serializer.errors,status=400)





class LogoutView(APIView):
    

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)