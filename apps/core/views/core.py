from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.views.generic import View,TemplateView
from django.template.response import TemplateResponse
from apps.core.models.user import User
from mysite.settings import DEBUG
import socket
# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        #creo super usuario
        if not User.objects.filter(username='root').exists():
            User.objects.create_superuser(
                username='root',
                password='1',
                email='root@rodrigoneira.cl'
        )
        if not DEBUG:
            return TemplateResponse(request, 'core/portafolio/index.html')
        else:
            return HttpResponseRedirect(reverse_lazy('dashboard'))

class DashboradView(LoginRequiredMixin,TemplateView):
    template_name = 'core/index.html'
    # success_url = reverse_lazy('user:user_list')
    # permission_required = ['core.add_user']

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        print('aca')
        return context

def error400(request, exception ):
    return render(request,'core/errors/400.html')

def error404(request, exception ):
    return render(request,'core/errors/404.html')

def error403(request, exception ):
    return render(request,'core/errors/403.html')

def error500(request ):
    return render(request,'core/errors/500.html')