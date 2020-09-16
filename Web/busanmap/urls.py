from django.contrib import admin
from django.urls import path, include
from busanmap.map import show_busan_map, indexPage, indexP, apitest
from busanmap.views import cctv

urlpatterns = [
    path('', indexPage, name='BusanMap'),
    path('model/', indexP, name='modeltest'),
    path('cctv/', cctv.as_view(), name='cctv'),
    path('apitest/', apitest, name='apitest'),
]
