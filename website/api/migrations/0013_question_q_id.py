# Generated by Django 3.1.7 on 2021-03-31 08:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20210331_0815'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='q_id',
            field=models.IntegerField(default=1),
        ),
    ]
