from django.dispatch import receiver
from simple_history.models import HistoricalRecords
from simple_history.signals import (
    pre_create_historical_record,
    post_create_historical_record,
    pre_create_historical_m2m_records,
    post_create_historical_m2m_records,
)

def add_history_ip_address(sender,request, instance, **kwargs):
    history_instance = kwargs['history_instance']
    # print(request.META)
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('HTTP_X_REAL_IP')
    if not ip_address:
        ip_address = request.META.get('REMOTE_ADDR')

    print(ip_address,'ip')
    history_instance.ip_address = ip_address
@receiver(pre_create_historical_record)
def pre_create_historical_record_callback(sender, **kwargs):

    add_history_ip_address(sender,HistoricalRecords.thread.request, **kwargs)
    print("Sent before saving historical record")

@receiver(post_create_historical_record)
def post_create_historical_record_callback(sender, **kwargs):
    print("Sent after saving historical record")

@receiver(pre_create_historical_m2m_records)
def pre_create_historical_m2m_records_callback(sender, **kwargs):
    print("Sent before saving many to many field on historical record")

@receiver(post_create_historical_m2m_records)
def post_create_historical_m2m_records_callback(sender, **kwargs):
    print("Sent after saving many to many field on historical record")