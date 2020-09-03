from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView


class cctv(TemplateView):
    template_name = 'test/cctv.html'
