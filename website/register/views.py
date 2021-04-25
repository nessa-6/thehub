from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
# from rest_framework import generics, status
# from .serializers import UserSerializer, LoginUserSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import authentication, permissions
from django.core import serializers
from rest_framework import routers, serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
import requests
from django.contrib.auth import logout as auth_logout
import json
# from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from django.contrib.auth import get_user_model, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.utils.timezone import now
from rest_framework import generics, status, views, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from djoser import signals, utils
from djoser.compat import get_user_email
from djoser.conf import settings

User = get_user_model()

# Create your views here.

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     authentication_classes = [authentication.TokenAuthentication]

# # class UserViewSet(APIView):
# #     queryset = User.objects.all()
# #     serializer_class = UserSerializer
# #     authentication_classes = [authentication.TokenAuthentication]

# class LoginUserView(APIView):
#     def get(self, request, format=None):
#         content = {
#             'user': str(request.user),  # `django.contrib.auth.User` instance.
#             'auth': str(request.auth),  # None
#         }
#         return Response(content)

# class loginUserView(APIView):
#     # queryset = User.objects.all()
#     # serializer_class = LoginUserSerializer
#     # authentication_classes = [authentication.TokenAuthentication]
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [BasicAuthentication,JSONWebTokenAuthentication]

#     def get(self, request,format=None):
#         data = {
#             'username': request.user.username,
#             'password':request.user.password,
#         }
#         return Response(data)
    # def post(self, request, format=None):
    #     print('\n\nHELLO\n\n')
    #     username = request.get('username')
    #     password = request.get('password')
    #     user = User.objects.get(username=username)
    #     if user is None:
    #         raise AuthenticationFailed('User not found.')
    #     if not user.check_password(password):
    #         raise AuthenticationFailed('Incorrect password.')

    #     return Response({'message': 'success'})

    

# Include an appropriate `Authorization:` header on all requests.
# token = Token.objects.get(user__username='new')
# client = APIClient()
# client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

@api_view(['GET'])
def restricted(self, request, *args, **kwargs):
    authentication_classes = [authentication.TokenAuthentication]
    return Response({'User': 'request.user.username'}, status=status.HTTP_200_OK)



@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def logout(request):
    authentication_classes = [authentication.TokenAuthentication]
    auth_logout(request)

class getTokenView(APIView):

    def get(self, request, *args, **kwargs):
        token = request.META['HTTP_AUTHORIZATION']
        print(token.key)


class TokenCreateView(utils.ActionViewMixin, generics.GenericAPIView):
    """
    Use this endpoint to obtain user authentication token.
    """

    serializer_class = settings.SERIALIZERS.token_create
    permission_classes = settings.PERMISSIONS.token_create

    def _action(self, serializer):
        token = utils.login_user(self.request, serializer.user)
        token_serializer_class = settings.SERIALIZERS.token
        return Response(
            data=token_serializer_class(token).data, status=status.HTTP_200_OK
        )