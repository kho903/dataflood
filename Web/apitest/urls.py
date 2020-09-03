from django.contrib import admin
from django.urls import path, include

from apitest.map import indexP

urlpatterns = [
    path('', indexP, name='apitest'),
]
