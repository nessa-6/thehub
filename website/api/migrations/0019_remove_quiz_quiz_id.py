# Generated by Django 3.1.7 on 2021-04-01 14:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_quiz_quiz_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='quiz_id',
        ),
    ]
