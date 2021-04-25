from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('quizzes', index),
    path('<str:subject>/<str:topic>/flashcards/<str:quizNum>', index),
    path('signup', index),
    path('login', index),
    path('profile', index), # make customized for each user
    path('<str:subject>', index),
    path('<str:subject>/<str:topic>', index),
]