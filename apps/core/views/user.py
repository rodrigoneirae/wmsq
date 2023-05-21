import base64,hashlib,uuid,smtplib,json
from django.views.generic import FormView, RedirectView, ListView, TemplateView, UpdateView
from django.contrib.auth.forms import AuthenticationForm
from django.urls import reverse_lazy
from mysite import settings
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth import login, logout
from apps.core.mixin.permisos import ValidatePermissionRequiredMixin
from django.contrib.auth.mixins import LoginRequiredMixin
from apps.core.models.user import User
from apps.core.forms.user import ResetForm,ChangePasswordForm
from django.contrib import messages
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.utils.translation import activate
from django.utils.translation import gettext



def asignar_grupo(user,grupo,modulo):
    # modulo = Module.objects.get(id=int(modulo))
    # grupo = modulo.modulegroup_set.get(id=int(grupo))
    # user = User.objects.get(id=int(user))
    # user.add_module_group_permissions(modulo, grupo)


    return 'OK'

#
class LoginFormView(FormView):
    form_class = AuthenticationForm
    template_name = 'core/auth/login.html'
    success_url = reverse_lazy(settings.LOGIN_REDIRECT_URL)

    # def post(self, request, *args, **kwargs):
    #     return HttpResponseRedirect(self.success_url)

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect(self.success_url)

        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):

        login(self.request, form.get_user())
        user_language = self.request.user.language
        activate(user_language)

        response= HttpResponseRedirect(self.success_url)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, user_language)
        return response


class LogoutView(RedirectView):
    pattern_name = 'login'

    def dispatch(self, request, *args, **kwargs):
        logout(request)
        response = super().dispatch(request, *args, **kwargs)
        response.delete_cookie(settings.LANGUAGE_COOKIE_NAME)
        return response


class UserListView(LoginRequiredMixin, ValidatePermissionRequiredMixin, ListView):
    model = User
    template_name = 'core/auth/index.html'
    permission_required = ['core.view_user']

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):

        data = {}
        try:
            action = request.POST['action']
            if action == 'searchdata':
                data = []

                if request.user.is_superuser:
                    for i in User.objects.all().exclude(pk=1):
                        data.append(i.toJSON())




        except Exception as e:

            messages.error(request, str(e).replace("'", ""))


        return JsonResponse(data, safe=False)


class UserCreateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, TemplateView):
    template_name = 'core/auth/user.html'
    success_url = reverse_lazy('user:user_list')
    permission_required = ['core.add_user']


    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        data = {}
        try:

            print('aca')
            data['rf']=False
            data['api']=False
            data['app']=False
            for d in json.loads(request.POST['data']):

                if d['name'] == 'password':
                    hashed_password = make_password(d['value'])
                if d['name'] == 'user_app':
                    data['app'] = True
                if d['name'] == 'user_rf':
                    data['rf']=True

                elif d['name'] == 'user_api':
                    data['api'] = True
                else:
                    data[d['name']] = d['value']


            user = User.objects.create(first_name=data['first_name'],
                                last_name=data['last_name'],
                                username=data['username'],
                                email=data['email'],
                                language=data['language'],
                                password=hashed_password,
                                is_api=data['api'],
                                is_rf=data['rf'],
                                )

            messages.success(request, gettext('Usuario Creado Correctamente'))

            return JsonResponse(reverse_lazy('user:user_update', kwargs={'pk': user.pk}), safe=False)


        except Exception as e:
            data['error'] = str(e)
            print(e)

            messages.error(request, data['error'])

        return HttpResponseRedirect(self.success_url)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['action'] = 'add'
        return context


class UserUpdateView(LoginRequiredMixin, ValidatePermissionRequiredMixin, TemplateView):
    template_name = 'core/auth/user_update.html'
    success_url = reverse_lazy('user:user_list')
    permission_required = 'change_user'

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            data = {}
            #print(request.POST['action'])

            if request.POST['action'] == 'modulo':
                pass

                #print(request.POST['id_modulo'],request.POST['id_usuario'])
                # id_user = int(request.POST['id_usuario'])
                # id_modulo = int(request.POST['id_modulo'])
                # user = User.objects.get(pk=id_user)
                # modulo = Module.objects.get(pk=id_modulo)
                # if request.POST['estado'] == '1':
                #     user.modules.add(modulo)
                #     user.save()
                #     estado='Activado'
                #
                # else:
                #     user.modules.remove(modulo)
                #     estado = 'Desactivado'
                #
                #
                # return JsonResponse(estado, safe=False)

            elif request.POST['action'] == 'data-user':
                print('aca')
                data['rf'] = False
                data['api'] = False
                data['app'] = False

                for d in json.loads(request.POST['data']):

                    # if d['name'] == 'password':
                    #     if user.password != d['value']:
                    #         hashed_password = make_password(d['value'])
                    if d['name'] == 'user_rf':
                        data['rf'] = True
                    elif d['name'] == 'user_app':
                        data['app'] = True
                    elif d['name'] == 'user_api':
                        data['api'] = True
                    else:
                        data[d['name']] = d['value']


                user = User.objects.filter(username=data['username']).last()
                if data['password'] != user.password:
                    hashed_password = make_password(data['password'])
                else:
                    hashed_password = user.password


                print(data)
                User.objects.filter(username=data['username']).update(first_name=data['first_name'],
                                           last_name=data['last_name'],
                                           username=data['username'],
                                           email=data['email'],
                                           language=data['language'],
                                           password=hashed_password,
                                           is_api=data['api'],
                                           is_rf=data['rf'],
                                           is_app=data['app'],
                                           )


                messages.success(request, gettext('Usuario Creado Correctamente'))
                return JsonResponse(reverse_lazy('user:user_update', kwargs={'pk': user.pk}), safe=False)

            elif request.POST['action'] == 'modulo-user':

                id_user=request.POST['id_user']
                user=User.objects.filter(pk=int(id_user)).last()
                modulos_usuario = user.modules.all()

                data=[]
                for m in modulos_usuario:
                    data.append({'id':m.id , 'name':m.name ,'user': id_user})

                return JsonResponse(data, safe=False)

            elif request.POST['action'] == 'submit-gruop':
                pass
                # for d in json.loads(request.POST['data']):
                #     data[d['name']] = d['value']
                #
                # group_name = f"{data['modulo']} - {data['name']}"
                #
                # if not Group.objects.filter(name=group_name).exists():
                #
                #     module = Module.objects.get(name=data['modulo'])
                #     group, created = Group.objects.get_or_create(name=group_name)
                #
                #     module_group = ModuleGroup.objects.create(
                #         name=group_name,
                #         module=module,
                #         is_active=True
                #     )
                #
                #     module_group.permissions.add(*group.permissions.all())
                #
                #     messages.success(request, 'Perfil creado correctamente')
                #
                # else:
                #     messages.warning(request, 'Perfil ya existe')
                #
                # return JsonResponse(self.success_url, safe=False)

            elif request.POST['action'] == 'submit-config-gruop':
                pass

                # id_modulo = int(request.POST['id_modulo'])
                # id_grupo = int(request.POST['id_grupo'])
                # modulo = Module.objects.get(id=id_modulo)
                # groupmodulo = ModuleGroup.objects.get(id=id_grupo)
                # data = []
                #
                # for permiso in Permission.objects.filter(module_permission__module=modulo):
                #
                #     estado = groupmodulo.permissions.filter(permission=permiso).exists()
                #     data.append({
                #         'nombre': permiso.name,
                #         'codename': permiso.codename,
                #         'estado': estado
                #     })
                #
                # return JsonResponse(data, safe=False)

            elif request.POST['action'] == 'submit-gruop-perimission':




                data=[]
                for d in json.loads(request.POST['data']):
                    pass
                    # print(d)
                #     if d['name'] == 'grupo':
                #         module= d['value'].split('-')[0]
                #         grupo= d['value'].split('-')[1]
                #         # reset permisos grupo
                #         for m in Module.objects.filter(id=int(module)):
                #             for p in m.modulepermission_set.all():
                #
                #                 permiso = Permission.objects.get(codename=p.permission.codename)
                #                 grupo_modulo = ModuleGroup.objects.get(id=int(grupo))
                #                 module_permission = ModulePermission.objects.get(permission=permiso,module=grupo_modulo.module)
                #                 grupo_modulo.permissions.remove(module_permission)
                #
                #     else:
                #
                #         if d['value'] == 'on':
                #             permiso = Permission.objects.get(codename=d['name'])
                #             grupo_modulo = ModuleGroup.objects.get(id=int(grupo))
                #             module_permission = ModulePermission.objects.get(permission=permiso,module=grupo_modulo.module)
                #             grupo_modulo.permissions.add(module_permission)
                #
                #
                #
                # messages.success(request,'Perfil actualizado')
                # return JsonResponse(self.success_url, safe=False)

            elif request.POST['action'] == 'language-change':

                user = User.objects.filter(pk=request.user.id).last()
                user.language = request.POST['language']
                user.save()
                activate(request.POST['language'])

                response = HttpResponseRedirect(request.path)
                response.set_cookie(settings.LANGUAGE_COOKIE_NAME, request.POST['language'])
                return response

        except Exception as e:
            print(e)

            messages.error(request, str(e).replace("'", ""))





    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        q = self.kwargs.get('pk', '')

        context['user'] = User.objects.filter(pk=q).last()
        # context['group'] = Group.objects.all()
        context['action'] = 'data-user'

        #creo modulo para test
        #my_module = Module.objects.create(name='Inbound', description='Ingreso Mercaderia WMS')
        # my_module = Module.objects.get(name='Inbound')
        # content_type = ContentType.objects.get_for_model(my_module)
        #admin_group1 = ModuleGroup.objects.create(name='Inbound-user', module=my_module, is_active=True)
        # admin_group2 = ModuleGroup.objects.create(name='outbound-user', module=my_module, is_active=True)
        #view_module_permission = Permission.objects.create(codename='can_edit_module_outbound', name='Can edit outbound', content_type=content_type,)
        # admin_group1.permissions.add(view_module_permission)

        # permission = Permission.objects.create(
        #     codename='can_view_module_inbound',  # El nombre del permiso
        #     name='Can view Module Inbound',
        #     content_type=content_type# El nombre legible del permiso
        # )


        # context['modulos'] = Module.objects.all()
        # user = User.objects.filter(pk=q).last()
        #
        # modulos_usuario = user.modules.all()
        # #
        # module_info = []
        # for um in modulos_usuario:
        #     module_info.append(um)
        # context['modulos_asignados'] = module_info

        # user = User.objects.get(id=q)
        # if user.groups.exists() and ModuleGroup.objects.filter(user=user).exists():
        #     # El usuario tiene al menos un grupo y un módulo asignados
        #     group = user.groups.first()
        #     grupos = list(user.groups.all())
        #     modulos = Module.objects.filter(modulegroup__user=user)
        #
        #     print(grupos,modulos)
        # else:
        #     print('nada sociado')


        #test de permiso
        # permiso = ModuloPermiso.objects.create(
        #     nombre='Permiso de ejemplo',
        #     descripcion='Este es un permiso de ejemplo',
        #     codigo='permiso_ejemplo'
        # )

        # permiso1 = ModuloPermiso(nombre='Ver usuarios', descripcion='Permiso para ver la lista de usuarios',
        #                          codigo='ver_usuarios')
        # permiso1.save()
        #
        # permiso2 = ModuloPermiso(nombre='Editar usuarios', descripcion='Permiso para editar un usuario',
        #                          codigo='editar_usuario')
        # permiso2.save()
        #
        # # permiso = ModuloPermiso.objects.get(pk=1)
        # grupo = Group.objects.get(name='admin')
        # grupo_permiso1 = GrupoModuloPermiso(grupo=grupo, modulo_permiso=permiso1)
        # grupo_permiso1.save()
        # grupo_permiso2 = GrupoModuloPermiso(grupo=grupo, modulo_permiso=permiso2)
        # grupo_permiso2.save()
        # grupo_modulo_permiso = GrupoModuloPermiso.objects.create(grupo=grupo, modulo_permiso=permiso)

        #
        #
        #
        # grupo = Group.objects.get(name='admin')
        #
        # grupo_modulo_permiso = GrupoModuloPermiso.objects.create(grupo=grupo, modulo_permiso=permiso)
        # # nuevo_grupo = Group(name="admin")
        # grupo_modulo_permiso.save()





        return context


class ResetFormView(FormView):
    form_class = ResetForm
    template_name = 'core/auth/reset_password.html'
    success_url = reverse_lazy('user:reset_password')

    def post(self, request, *args, **kwargs):

        data = {}

        try:
            form = self.get_form()
            if form.is_valid():
                user = form.get_user()
                data = self.send_email_reset_pwd(user)

                messages.success(request, data['success'])

            else:

                messages.error(request, form.errors)




        except Exception as e:
            data['error'] = str(e)

        return HttpResponseRedirect(self.success_url)

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return HttpResponseRedirect(self.success_url)

        return super().dispatch(request, *args, **kwargs)

    def send_email_reset_pwd(self, user):
        data = {}
        try:
            URL = settings.DOMAIN if not settings.DEBUG else self.request.META['HTTP_HOST']
            user.reset_token = uuid.uuid4()
            user.save()

            mailServer = smtplib.SMTP(''.join(settings.SMTP_CORE_HOST), settings.SMTP_CORE_PORT)
            mailServer.starttls()
            mailServer.login(''.join(settings.EMAIL_CORE_USER), ''.join(settings.EMAIL_CORE_PASSWORD))

            email_to = user.email
            mensaje = MIMEMultipart()
            mensaje['From'] = ''.join(settings.EMAIL_CORE_USER)
            mensaje['To'] = email_to
            mensaje['Subject'] = 'Recuperación Contraseña'

            content = render_to_string('core/auth/send_email.html', {
                'user': user,
                'link_resetpwd': 'http://{}/user/change/password/{}/'.format(URL, str(user.reset_token)),
                'link_home': 'http://{}'.format(URL)
            })
            mensaje.attach(MIMEText(content, 'html'))

            mailServer.sendmail(settings.EMAIL_CORE_USER,
                                email_to,
                                mensaje.as_string())

            data['success'] = 'Email enviado correctamente!.'


        except Exception as e:
            print(e)
            data['error'] = e


        return data

class ChangePasswordView(FormView):

    form_class = ChangePasswordForm
    template_name = 'core/auth/change_password.html'
    success_url = reverse_lazy(settings.LOGIN_REDIRECT_URL)

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        token = self.kwargs['token']
        data = {}

        if User.objects.filter(reset_token=token).exists():
            return super().get(request, *args, **kwargs)

        data['error'] = 'Token No Valido !.'
        messages.error(request, data['error'])
        return HttpResponseRedirect(reverse_lazy('user:reset_password'))

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            form = ChangePasswordForm(request.POST)

            if form.is_valid():

                user = User.objects.get(reset_token=self.kwargs['token'])
                # cambio password djsat
                user.set_password(request.POST['password'])
                user.reset_token = uuid.uuid4()
                user.save()
                data['success'] = 'Contraseña cambiada'
                messages.success(request, data['success'])
                return HttpResponseRedirect('/')

            else:

                data['error'] = form.errors
                messages.error(request, data['error'])
                return HttpResponseRedirect('.')

        except Exception as e:

            data['error'] = str(e)
            messages.error(request, data['error'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Reseteo de Contraseña'
        context['login_url'] = settings.LOGIN_URL
        return context