

from django.shortcuts import render
from django.views.generic import TemplateView
# Create your views here.

class AmniView(TemplateView):
    template_name = 'amni_test.html'