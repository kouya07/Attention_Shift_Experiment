from django.urls import path
from cms import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('index/cursor_log/', views.requested_cursorlog),
    path('login/user_log/', views.requested_userlog),
    path('index/user_info/', views.user_info),
    path('index/log/', views.log),
]
