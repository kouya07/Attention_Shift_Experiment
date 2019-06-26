from django.urls import path
from cms import views

urlpatterns = [
    path('index/', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('index/cursorlog/', views.requested_cursorlog),
    path('login/userlog/', views.requested_userlog),
    path('index/userinfo/', views.userinfo),
]
