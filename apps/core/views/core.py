from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import View
from django.template.response import TemplateResponse
# Create your views here.
class IndexView(View):
    def get(self, request, *args, **kwargs):
        return TemplateResponse(request, 'core/index.html')


def error400(request, exception ):
    return render(request,'core/errors/400.html')

def error404(request, exception ):
    return render(request,'core/errors/404.html')

def error403(request, exception ):
    return render(request,'core/errors/403.html')

def error500(request ):
    return render(request,'core/errors/500.html')