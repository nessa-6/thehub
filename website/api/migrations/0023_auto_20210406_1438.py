# Generated by Django 3.1.7 on 2021-04-06 13:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_auto_20210405_1433'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Topic',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('topic', models.CharField(max_length=100)),
                ('topic_subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.subject')),
            ],
        ),
        migrations.AddField(
            model_name='quiz',
            name='quiz_subject',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.subject'),
        ),
        migrations.AddField(
            model_name='quiz',
            name='quiz_topic',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.topic'),
        ),
    ]
