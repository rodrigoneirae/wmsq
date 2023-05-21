from datetime import datetime

from crum import get_current_request
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import redirect
from django.urls import reverse_lazy
# from apps.core.models.user import User

class IsSuperuserMixin(object):
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return super().dispatch(request, *args, **kwargs)
        return redirect('dashboard')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['date_now'] = datetime.now()
        return context

class ValidatePermissionRequiredMixin(object):
    permission_required = ''
    url_redirect = None

    def get_perms(self):
        perms = []
        if isinstance(self.permission_required, str):
            perms.append(self.permission_required)
        else:
            perms = list(self.permission_required)

        # print(perms)
        return perms

    def get_url_redirect(self):
        return reverse_lazy('dashboard')


    def dispatch(self, request, *args, **kwargs):
        request = get_current_request()
        perms=request.user.get_group_permissions()

        if request.user.is_superuser:
            return super().dispatch(request, *args, **kwargs)

        #si no es supersuer
        p_requerido = self.get_perms()
        if not perms is None:
            for p in perms:

                if p in p_requerido:
                    return super().dispatch(request, *args, **kwargs)



        #sin accesp
        messages.error(request, 'No tiene permiso para ingresar a este módulo')
        return HttpResponseRedirect(self.get_url_redirect())