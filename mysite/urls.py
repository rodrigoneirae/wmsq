from django.contrib import admin
from django.urls import path,include
from apps.core.views.core import IndexView,DashboradView,error400,error403,error404,error500
from apps.core.views.user import LoginFormView,LogoutView
urlpatterns = [
    path('', IndexView.as_view(), name='portafolio'),
    path('login', LoginFormView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('dashboard', DashboradView.as_view(), name='dashboard'),
    path('admin/', admin.site.urls),
    path('user/', include('apps.core.urls.user')),
]

handler400=error400
handler403=error403
handler404=error404
handler500=error500