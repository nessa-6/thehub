from django.contrib import admin
from .models import Question, Answers, Quiz, Subject, Topic, Tag
from django.db.models import Count
from django.utils.translation import gettext_lazy as _
from django.utils.datastructures import MultiValueDictKeyError

# Register your models here.
# admin.site.register(Quiz)

# class AnswerInline(admin.TabularInline):
#     model = Answers

# class QuestionAdmin(admin.ModelAdmin):
#     inlines = [AnswerInline]

# class UserAdmin(admin.ModelAdmin):
#     model = Use
# 

class TopicFilter(admin.SimpleListFilter):
    title = _("Topic")
    parameter_name = "topic"

    def lookups(self, request, model_admin):
        try:
            lookup_id = request.GET['subject']
            allmat = set([q.quiz_topic for q in Quiz.objects.filter(quiz_topic__topic_subject__id=lookup_id)])
            return [(q.id, q.topic) for q in allmat]
        except MultiValueDictKeyError:
            allmat = set([q.quiz_topic for q in Quiz.objects.all()])
            return [(q.id, q.topic) for q in allmat]



    def queryset(self, request, queryset):
        try:
            if request.GET['topic'] and request.GET['subject']:
                topic_id = request.GET['topic']
                sub_id = request.GET['subject']
                return Quiz.objects.filter(quiz_topic__topic_subject=sub_id).filter(quiz_topic=topic_id)
        except MultiValueDictKeyError:
            try:
                if request.GET['topic']:
                    topic_id = request.GET['topic']
                    return Quiz.objects.filter(quiz_topic=topic_id)
            except MultiValueDictKeyError:
                try:
                    if request.GET['subject']: 
                        sub_id = request.GET['subject']
                        return Quiz.objects.filter(quiz_topic__topic_subject=sub_id)
                except MultiValueDictKeyError:
                    return Quiz.objects.all()

class SubjectFilter(admin.SimpleListFilter):
    title = _("Subject")
    parameter_name = "subject"


    def lookups(self, request, model_admin):
        allmat = set([q.topic_subject for q in Topic.objects.all()])
        return [(q.id, q.subject) for q in allmat]

    def queryset(self, request, queryset):
        return queryset.filter(quiz_topic=self.value())

class QuestionsInstanceInline(admin.TabularInline):
    model = Quiz
    fields = ['quiz_topic__topic',]
    extra = 0

class QuizTopicFilter(admin.SimpleListFilter):
    title = _("Quiz")
    parameter_name = "quiz"

    def lookups(self, request, model_admin):
        try:
            lookup_id = request.GET['topic']
            allmat = set([q.quiz_topic for q in Question.objects.filter(quiz__quiz_topic__topic_subject__id=lookup_id)])
            return [(q.id, q.topic) for q in allmat]
        except MultiValueDictKeyError:
            allmat = set([q.quiz_topic for q in Quiz.objects.all()])
            return [(q.id, q.topic) for q in allmat]



    def queryset(self, request, queryset):
        try:
            if request.GET['topic'] and request.GET['subject']:
                topic_id = request.GET['topic']
                sub_id = request.GET['subject']
                return Quiz.objects.filter(quiz_topic__topic_subject=sub_id).filter(quiz_topic=topic_id)
        except MultiValueDictKeyError:
            try:
                if request.GET['topic']:
                    topic_id = request.GET['topic']
                    return Quiz.objects.filter(quiz_topic=topic_id)
            except MultiValueDictKeyError:
                try:
                    if request.GET['subject']: 
                        sub_id = request.GET['subject']
                        return Quiz.objects.filter(quiz_topic__topic_subject=sub_id)
                except MultiValueDictKeyError:
                    return Quiz.objects.all()

class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "quizn")
    list_filter = ['quiz__quiz_title', 'quiz__quiz_topic__topic']
    def quizn(self, obj):
        quiz = Quiz.objects.get(id=obj.id)
        return quiz

class QuizAdmin(admin.ModelAdmin):
    list_display = ('quiz_title', 'just_topic', 'subject', 'number_of_questions')
    
    
    #inlines = [QuestionsInstanceInline]
    # list_filter = (('quiz_topic__topic_subject', admin.RelatedOnlyFieldListFilter), ('quiz_topic', admin.RelatedOnlyFieldListFilter))
    list_filter = [SubjectFilter, TopicFilter]
    def number_of_questions(self, obj):
        quiz = Quiz.objects.get(id=obj.id)
        return quiz.question_set.all().count()
    def just_topic(self, obj):
        return obj.quiz_topic.topic
    def subject(self, obj):
        return obj.quiz_topic.topic_subject

    search_fields = ['quiz_topic__topic_subject__subject', 'quiz_topic__topic', 'quiz_title']
    just_topic.short_description = 'Topic'
    

class TopicAdmin(admin.ModelAdmin):
    list_display = ('topic', 'topic_subject', 'number_of_quizzes')
    list_filter = ('topic_subject',)
    search_fields = ['topic', 'topic_subject__subject']
    def number_of_quizzes(self, obj):
        topic = Topic.objects.get(id=obj.id)
        return topic.quiz_set.all().count()

class AnswerAdmin(admin.ModelAdmin):
    readonly_fields = ('answer', 'score', 'q', 'user')

admin.site.register(Question, QuestionAdmin)
# admin.site.register(User, UserAdmin)
admin.site.register(Answers)
admin.site.register(Quiz, QuizAdmin)
admin.site.register(Subject)
admin.site.register(Topic, TopicAdmin)
admin.site.register(Tag)