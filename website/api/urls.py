from django.urls import path
from .views import AnswerSubmitView, sendQuestionView, getQuestions, getTopic, alreadyAnsweredView, ResultsView, TopicView, getQuizzesView, importQuestions

urlpatterns = [
    # path('quiz', QuizView.as_view()),
    path('flashcards', AnswerSubmitView.as_view()),
    path('question', sendQuestionView.as_view()),
    path('import/<str:subject>', importQuestions.as_view()),
    path('<str:subject>/<str:topic>/<str:quizNum>', getQuestions.as_view()), # change later to quiz view
    path('topic', getTopic.as_view()),
    path('answers', alreadyAnsweredView.as_view()),
    path('results', ResultsView.as_view()),
    path('<str:subject>', TopicView.as_view()),
    path('<str:subject>/<str:topic>', getQuizzesView.as_view()),
]