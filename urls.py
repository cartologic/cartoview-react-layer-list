from django.conf.urls import patterns, url, include
from . import views, APP_NAME

app_name = APP_NAME

urlpatterns = patterns('',
   # app urls
   # url(r'^$', views.index, name='%s.index' % APP_NAME),

   # http://localhost:8000/apps/cartoview_templates/layers
   url(r'^layers$', views.layers, name='%s.layers' % APP_NAME),

   # http://localhost:8000/apps/cartoview_templates/maps
   url(r'^maps', views.maps, name='%s.maps' % APP_NAME),
)
