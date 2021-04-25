from django.shortcuts import render, get_object_or_404, redirect
from rest_framework import generics, status
from .serializers import AnswerSubmitSerializer, QuestionSerializer, AlreadyAnsweredSerializer, SubjectSerializer, TopicSerializer, QuizSerializer
from .models import Answers, Question, Quiz, Subject, Topic
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.core import serializers
from django.http import JsonResponse
import json
from itertools import chain

import gspread
from oauth2client.service_account import ServiceAccountCredentials
from pprint import pprint
# Create your views here.

class TopicView(APIView):
    serializer_class = TopicSerializer
    permission_classes = []
    # authentication_classes = [authentication.TokenAuthentication]
    def post(self, request, subject, format=None):
        # sub = Subject.objects.filter(subject=subject.title()).values('id')
        # if sub != None:
        send_sub = Topic.objects.filter(topic_subject__subject__iexact=subject).values('topic')
        if send_sub != None and send_sub:
            return Response(send_sub, status=status.HTTP_200_OK)

        return Response({'statusText': 'Invalid Topic Param'}, status=status.HTTP_400_BAD_REQUEST)


class AnswerSubmitView(APIView):
    serializer_class = AnswerSubmitSerializer
    authentication_classes = [authentication.TokenAuthentication]
    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            print(serializer)
            answer = serializer.data.get('answer')
            score = serializer.data.get('score')
            q = Question.objects.get(id=serializer.data.get('q'))

            if Answers.objects.filter(q=q, user=self.request.user).count() > 0:
                to_update = Answers.objects.get(q=q, user=self.request.user)
                to_update.answer = answer
                to_update.score = score
                to_update.save(update_fields=['answer', 'score'])
                return Response(AnswerSubmitSerializer(to_update).data, status=status.HTTP_200_OK)

            final = Answers(answer=answer, score=score, q=q, user=self.request.user)
            final.save()

            return Response(AnswerSubmitSerializer(final).data, status=status.HTTP_200_OK)


        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)



class alreadyAnsweredView(APIView):
    serializer_class = AlreadyAnsweredSerializer
    authentication_classes = [authentication.TokenAuthentication]

    def post(self, request, format=None):
        print(request.data)
        #cond = list(chain([Answers.objects.filter(q=q, user=self.request.user).values('q','score') for q in request.data['q'] if Answers.objects.get(q=q, user=self.request.user)]))
        # result_list = list(chain(page_list, article_list, post_list))
        res = []
        for q in request.data['q']:
            try:
                if Answers.objects.get(q=q, user=self.request.user):
                    res += Answers.objects.filter(q=q, user=self.request.user).values('q','score')
            except Answers.DoesNotExist:
                continue 

        print(res)
        if res and res != []:
            return Response(res, status=status.HTTP_200_OK)

        return Response({'No questions found': 'User not answered quiz before'}, status=status.HTTP_200_OK)


# NOT USED ?
class sendQuestionView(APIView):

    serializer_class = QuestionSerializer
    authentication_classes = [authentication.TokenAuthentication]
    
    def post(self, request, format=None):

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            
            quiz = serializer.data.get('quiz')

            questions = Question.objects.filter(quiz=quiz).values('text', 'id', 'correct_ans', 'explanation', 'img', 'tip')
            
            return Response(questions, status=status.HTTP_200_OK)


class getQuestions(APIView):
    serializer_class = QuestionSerializer
    def get(self, request, subject, topic, quizNum, format=None):
        if subject and topic and quizNum:
            data = Question.objects.filter(quiz__quiz_topic__topic_subject__subject__iexact=subject).filter(quiz__quiz_topic__topic__iexact=topic).filter(quiz__id=quizNum).values('text', 'correct_ans', 'explanation', 'tip', 'id', 'img')
            print(Question.objects.filter(quiz__quiz_topic__topic_subject__subject__iexact=subject).filter(quiz__quiz_topic__topic__iexact=topic).filter(quiz__id=quizNum))
            if data:
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Parameter(s) invalid'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'Bad Request': 'Parameter(s) missing'}, status=status.HTTP_400_BAD_REQUEST)


# NOT USED ?
class getTopic(APIView):
    lookup_url_kwarg = 'quizNum'
    serializer_class = QuestionSerializer
    def get(self, request, format=None):
        quiz_num = request.GET.get(self.lookup_url_kwarg)
        if quiz_num != None:
            topic = Quiz.objects.filter(id=quiz_num).values('quiz_title', 'id')
            #topic = getattr(topic, 'quiz_title')
            if topic:
                return Response(topic[0], status=status.HTTP_200_OK)
            return Response({'Quiz not found': 'Invalid quiz number'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'QuizNum parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class ResultsView(APIView):
    serializer_class = QuestionSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        print(serializer)
        if serializer.is_valid():
            quiz = serializer.data.get('quiz')
            d = {}
            two = []
            results_set = Answers.objects.filter(q__quiz_id=quiz, user=self.request.user).values('q', 'score')
            for r in results_set:
                if r['score'] == 0:
                    d['zero'] = Question.objects.filter(id=r['q']).values('text')
                elif r['score'] == 1:
                    d['one'] = Question.objects.filter(id=r['q']).values('text')
                elif r['score'] == 2:
                    two += Question.objects.filter(id=r['q']).values('text')
            d['two'] = two
            return Response(d, status=status.HTTP_200_OK)
        
        return Response({'Bad request': 'No response found'}, status=status.HTTP_400_BAD_REQUEST)

class getQuizzesView(APIView):
    permission_classes = []
    def post(self, request, subject, topic, format=None):
        send_sub = Quiz.objects.filter(quiz_topic__topic_subject__subject__iexact=subject).filter(quiz_topic__topic__iexact=topic).values('quiz_title', 'id')
        if send_sub:
            return Response(send_sub, status=status.HTTP_200_OK)

        return Response({'statusText': 'Invalid Param(s)'}, status=status.HTTP_400_BAD_REQUEST)

class importQuestions(APIView):
    permission_classes = []
  

    def post(self, request, subject, format=None):
        scope = ["https://spreadsheets.google.com/feeds",'https://www.googleapis.com/auth/spreadsheets',"https://www.googleapis.com/auth/drive.file","https://www.googleapis.com/auth/drive"]
        creds = ServiceAccountCredentials.from_json_keyfile_name("api/creds.json", scope)
        client = gspread.authorize(creds)
        sheet = client.open(subject + " questions").sheet1  # Open the spreadsheet
        data = sheet.get_all_records()  # Get a list of all records

        new_data = [x for x in data if x['Status'] == 'NEW']
        update_data = [x for x in data if x['Status'] == 'UPDATE']
        successful = []
        success = {}
        count = 1
        li1 = []
        li2 = []

        if new_data:
            for x in new_data:
                if x['Question'] and x['Correct Answer'] and x['Topic'] and x['Quiz'] and x['ID']:
                    # Gets quiz id
                    quiz_id = Quiz.objects.filter(quiz_topic__topic_subject__subject__iexact=subject).filter(quiz_topic__topic__iexact=x['Topic']).filter(quiz_title__iexact=x['Quiz']).values('id')
                    if not quiz_id:
                        return Response({'No Quiz found with this name': x['Quiz']})
                    quiz_id = quiz_id[0]['id'] # turns from queryset into integer
                    if Question.objects.filter(text=x['Question']):
                        successful.append(success)
                        if li1 != []:
                            sheet.batch_update(li1)
                            # sheet.batch_update(li2)
                        return Response({'Already exists': x['Question'], 'Questions added successfully': successful})
                    else:
                        quiz = Quiz.objects.filter(id=quiz_id).values('id')
                        n = Question.objects.create(text=x['Question'], quiz_id=quiz, correct_ans=x['Correct Answer'], explanation=x['Explanation'], tip=x['Tip'], img=x['Image'])
                        success[count] = x['Question']
                        count += 1

                        dic1 = {}
                        num = int(x['ID']) + 1
                        dic1['range'] = 'I' + str(num) + ':J' + str(num)
                        dic1['values'] = [['ACTIVE', n.id]]
                        li1.append(dic1)

                        # dic2 = {}
                        # dic2['range'] = 'J' + str(num)
                        # dic2['values'] = [[n.id]]
                        # li2.append(dic2)

                        print('Question \'' + x['Question'] + '\' added to database')
                else:
                    successful.append(success)
                    if li1 != []:
                        sheet.batch_update(li1)
                    return Response({'Bad Request': 'Missing fields', 'Questions added successfully': successful})
        
        update_success = {}
        update_successful = []
        count = 1
        if update_data:
            for x in update_data:
                if x['Question'] and x['Correct Answer'] and x['Topic'] and x['Quiz'] and x['ID'] and x['Question ID']:
                    quiz = Quiz.objects.filter(quiz_title=x['Quiz']).values('id')
                    if not quiz:
                        return Response({'Quiz not found': x['Quiz']})
                    updated = Question(id=x['Question ID'], text=x['Question'], quiz_id=quiz, correct_ans=x['Correct Answer'], explanation=x['Explanation'], tip=x['Tip'], img=x['Image'])
                    updated.save()
                    update_success[count] = x['Question']
                    count += 1

                    dic1 = {}
                    num = int(x['ID']) + 1
                    dic1['range'] = 'I' + str(num)
                    dic1['values'] = [['ACTIVE']]
                    li1.append(dic1)
                else:
                    update_successful.append(update_success)
                    if li1 != []:
                        sheet.batch_update(li1)
                    return Response({'Bad Request': 'Missing fields', 'Questions updated successfully': update_successful})


        if li1 != []:
            successful.append(success)
            update_successful.append(update_success)
            sheet.batch_update(li1)
            # sheet.batch_update(li2)
            return Response({'New Questions': successful, 'Updated Questions': update_successful}, status=status.HTTP_200_OK)
        return Response({'Bad Request'})