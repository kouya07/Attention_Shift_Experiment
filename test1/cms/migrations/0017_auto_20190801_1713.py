# Generated by Django 2.0.1 on 2019-08-01 08:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0016_auto_20190731_1118'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cursorlog',
            old_name='round',
            new_name='trial',
        ),
    ]
