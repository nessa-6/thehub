from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

# Serializers define the API representation.

# class UserSerializer(serializers.ModelSerializer):
#     email = serializers.EmailField(
#             required=True,
#             validators=[UniqueValidator(queryset=User.objects.all())]
#             )
#     username = serializers.CharField(
#             validators=[UniqueValidator(queryset=User.objects.all())]
#             )
#     password = serializers.CharField(min_length=8, write_only=True)
#     password_confirm = serializers.CharField(min_length=8, write_only=True)

#     def validate(self, data):
#         if data['password'] != data['password_confirm']:
#             print(data['password'])
#             raise serializers.ValidationError("The two password fields must match.")
#         else:
#             return data

#     def create(self, validated_data):
#         user = User.objects.create_user(validated_data['username'], validated_data['email'],
#              validated_data['password'])
#         return user

#     class Meta:
#         model = User
#         fields = ('id', 'username', 'email', 'password', 'password_confirm')

# class LoginUserSerializer(serializers.ModelSerializer):
#     username = serializers.CharField()
#     password = serializers.CharField(write_only=True)


#     class Meta:
#         model = User
#         fields = ('username', 'password')

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'email', 'password')