from django.contrib import admin
from django.urls import path, include

from modeltest.map import indexP
from modeltest.views import cctv
from . import views

urlpatterns = [
    path('', indexP, name='modeltest'),
    path('cctv/', cctv.as_view(), name='cctv'),
]
