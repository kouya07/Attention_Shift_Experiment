from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, UserManager
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.utils.translation import gettext_lazy as _


class User(AbstractBaseUser, PermissionsMixin):
    user_vali = UnicodeUsernameValidator()
    username = models.CharField(_('username'), max_length=150, unique=True, validators=[user_vali])
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(_('staff status'), default=False)

    objects = UserManager()

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'participant_number']


class CursorLog(models.Model):
    # id = models.CharField(primary_key=True, max_length=20)
    participant_number = models.CharField(max_length=20)
    mouse_event = models.CharField(max_length=20)
    time = models.CharField(max_length=30)
    time_ms = models.CharField(max_length=20, null=True)
    pointer_x = models.CharField(max_length=20)
    pointer_y = models.CharField(max_length=20)
    judgment = models.CharField(max_length=20)
    s = models.CharField(max_length=20)
    T1 = models.CharField(max_length=20)
    T2 = models.CharField(max_length=20)
    trial = models.CharField(max_length=20, null=True)
    trial_time_ms = models.CharField(max_length=20, null=True)
    trial_to_down = models.CharField(max_length=20, null=True)
    trial_to_up = models.CharField(max_length=20, null=True)


class UserLog(models.Model):
    # id = models.CharField(primary_key=True, max_length=20)
    participant_number = models.CharField(max_length=20)
    inconsistency = models.CharField(max_length=20)
    result_feedback = models.CharField(max_length=20)
    memory_interference = models.CharField(max_length=20)
    control_mode = models.CharField(max_length=20, null=True)
    device = models.CharField(max_length=20, null=True)
    block_number = models.CharField(max_length=20)
    start_time = models.CharField(max_length=20, null=True)
    end_time = models.CharField(max_length=20, null=True)
