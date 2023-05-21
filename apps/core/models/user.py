from django.contrib.auth.models import AbstractUser
from django.db import models
from django.forms import model_to_dict
from simple_history.models import HistoricalRecords
import socket
# from modules.maestros.models.company import Company


class IPAddressHistoricalModel(models.Model):
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    history_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.ip_address = socket.gethostbyname(socket.gethostname())
        super().save(*args, **kwargs)

class User(AbstractUser):
    #company=models.ManyToManyField(Company,blank=True)
    language = models.CharField(max_length=2, default='en')
    is_app = models.BooleanField(default=False)
    is_rf = models.BooleanField(default=False)
    is_api = models.BooleanField(default=False)
    reset_token = models.UUIDField(primary_key=False, editable=False, null=True, blank=True)
    remember_token = models.UUIDField(primary_key=False, editable=False, null=True, blank=True)
    # modules = models.ManyToManyField(Module, blank=True)
    history = HistoricalRecords(bases=[IPAddressHistoricalModel])
    def __str__(self):
        return self.username
    def toJSON(self):
        item = model_to_dict(self, exclude=['password', 'user_permissions'])
        if self.last_login:
            item['last_login'] = self.last_login.strftime('%d-%m-%Y %H:%M:%S')
        item['date_joined'] = self.date_joined.strftime('%Y-%m-%d')
        item['full_name'] = self.get_full_name()
        item['groups'] = [{'id': g.id, 'name': g.name} for g in self.groups.all()]
        return item