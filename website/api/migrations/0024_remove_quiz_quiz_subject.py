# Generated by Django 3.1.7 on 2021-04-06 16:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0023_auto_20210406_1438'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='quiz_subject',
        ),
    ]
