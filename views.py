from django.shortcuts import render, HttpResponse, redirect, HttpResponseRedirect
from . import APP_NAME


# def index(request):
#     # renders home page for cartoview new templates using react js
#     return render(request, template_name="%s/index.html" % APP_NAME, context={'message':'Hello from %s'% APP_NAME,'app_name':APP_NAME})


def layers(request):
    # renders the layers template
    return render(request, template_name="%s/layers.html" % APP_NAME, context={'message':'Hello from %s'% APP_NAME,'app_name':APP_NAME})


def maps(request):
    # renders the layers template
    return render(request, template_name="%s/maps.html" % APP_NAME, context={'message':'Hello from %s'% APP_NAME,'app_name':APP_NAME})
