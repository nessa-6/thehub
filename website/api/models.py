from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator 


# # Create your models here.
# class UserLogin(models.Model):
# #     # _id = models.IntegerField(default="", unique=True, null=False)  #constraints for unique id for each user
#     username = models.CharField(max_length=50, unique=True)
#     password = models.CharField(max_length=20, null=False)


class Subject(models.Model):
    subject = models.CharField(max_length=30)
    def __str__(self):
        return str(self.subject)

class Topic(models.Model):
    topic = models.CharField(max_length=100)
    topic_subject = models.ForeignKey(Subject, on_delete=models.CASCADE, verbose_name='Subject')
    def __str__(self):
        return f'{str(self.topic_subject)}: {str(self.topic)}'

class Quiz(models.Model):
#     subject = models.CharField(max_length=20, default='Maths', blank='True')
#     topic = models.CharField(max_length=200)
    quiz_title = models.CharField(max_length=200, null=True)
    # quiz_subject = models.ForeignKey(Subject, on_delete=models.CASCADE, null=True)
    quiz_topic = models.ForeignKey(Topic, on_delete=models.CASCADE, null=True, verbose_name='Topic')
    # quiz_id = models.IntegerField(unique=True, null=False, default=1)
        # question_slug = models.CharField(max_length=200, default=1)
#     number_of_questions = models.IntegerField(validators=[MinValueValidator(1)])
#     answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.quiz_title}'

#     def get_questions(topic):
#         return self.question_set.all()

    class Meta:
        verbose_name_plural = 'Quizzes'


class Tag(models.Model):
    name = models.CharField(max_length=30, null=True, default='flashcards', blank=True)

    def __str__(self):
        return self.name
    

class Question(models.Model):
    # q_id = models.IntegerField()
    # q_id = models.IntegerField(default=1)
    text = models.CharField(max_length=200) # question text
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    correct_ans = models.CharField(max_length=400, null=True) # correct answer
    explanation = models.CharField(max_length=400, null=True, blank=True) # keep null and blank
    tip = models.CharField(max_length=400, null=True, blank=True)  # keep null and blank
    img = models.ImageField(null=True, blank=True, upload_to='images/')
    tags = models.ManyToManyField(Tag, blank=True)

    def __str__(self):
        return str(self.text)

    # def get_answers(self):
    #     return self.answer_set.all()

CORRECT_CHECK = ((0,0), (1,1), (2,2))
class Answers(models.Model):
    answer = models.CharField(max_length=400) # user's answer
    score = models.IntegerField(choices=CORRECT_CHECK, default=0) # score
    q = models.ForeignKey(Question, on_delete=models.CASCADE, null=True) # question that answer corresponds to
    user = models.ForeignKey(User, max_length=50, null=True, on_delete=models.CASCADE)  # CHANGE DEFAULT TO SESSION USER
    #q_id = models.IntegerField(unique=False, default=1) # has to match with id of question, but there can be multiple answers

    def __str__(self):
        return f'question: {self.q_id}, answer: {self.answer}, score: {self.score}'

    class Meta:
        verbose_name_plural = 'Answers'

DIFF_CHOICES = ((1, 1), (2, 2), (3, 3))
class Difficulty(models.Model):
    difficulty = models.IntegerField(choices=DIFF_CHOICES, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)