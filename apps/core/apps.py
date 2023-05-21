from django.apps import AppConfig
from simple_history.signals import pre_create_historical_record
from apps.core.signals import add_history_ip_address


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.core'

    def ready(self):
        from apps.core.models.user import User
        pre_create_historical_record.connect(
            add_history_ip_address,
            sender=User
        )