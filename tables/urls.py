from django.conf.urls import patterns, url

from tables import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^(?P<model_name>[\w]+)/$', views.get_tables, name='get_tables'),
    url(r'^(?P<model_name>[\w]+)/(?P<id_value>\d+)$', views.set_field, name='set_field'),
)
