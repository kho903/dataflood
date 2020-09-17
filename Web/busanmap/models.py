from django.db import models


# Create your models here.

class PihMerge(models.Model):
    ADM_CD = models.BigIntegerField()
    ZONE = models.CharField(max_length=10)
    PUMP_RATIO = models.FloatField()
    IMP_SUR_RATIO = models.FloatField()
    MANHOLES_RATIO = models.FloatField()
