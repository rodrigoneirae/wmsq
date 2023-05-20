from django.contrib import admin
from django.urls import path
from apps.core.views.core import IndexView,error400,error403,error404,error500

urlpatterns = [
    path('', IndexView.as_view(), name='dashboard'),
    path('admin/', admin.site.urls),
]

handler400=error400
handler403=error403
handler404=error404
handler500=error500