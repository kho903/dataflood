from django.urls import path
from busanmap.map import indexPage, indexP, apitest
from busanmap.views import cctv

urlpatterns = [
    path('', indexPage, name='BusanMap'),
    path('model/', indexP, name='modeltest'),
    path('cctv/', cctv.as_view(), name='cctv'),
    path('apitest/', apitest, name='apitest'),
]
