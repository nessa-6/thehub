from rest_framework import serializers
from .models import Answers, Question, Subject, Topic, Quiz


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ('id',)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ('subject',)

class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ('topic',)


class AnswerSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ('answer', 'score', 'q')

class AlreadyAnsweredSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answers
        q = serializers.ListField(
    child = serializers.IntegerField(min_value = 0)
    )
        fields = ('q',)

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ('quiz',)