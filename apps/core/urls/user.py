from django.urls import path
from apps.core.views.user import *

app_name = 'user'

urlpatterns = [
    # user
    path('list/', UserListView.as_view(), name='user_list'),
    path('add/', UserCreateView.as_view(), name='user_create'),
    path('update/<int:pk>/', UserUpdateView.as_view(), name='user_update'),
    # #path('delete/<int:pk>/', UserDeleteView.as_view(), name='user_delete'),
    # #path('change/group/<int:pk>/', UserChangeGroup.as_view(), name='user_change_group'),
    # path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('change/password/<str:token>/', ChangePasswordView.as_view(), name='change_password'),
    path('reset/password/', ResetFormView.as_view(), name='reset_password'),
]