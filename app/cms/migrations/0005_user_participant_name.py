# Generated by Django 2.0.1 on 2019-06-14 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0004_auto_20190612_0450'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='participant_name',
            field=models.CharField(max_length=150, null=True, unique=True, verbose_name='participant_name'),
        ),
    ]
