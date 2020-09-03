from django.contrib import admin
from django.urls import path, include

from modeltest.map import indexP

urlpatterns = [
    path('', indexP, name='modeltest'),
]
