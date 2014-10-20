from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import get_models, get_app, get_model


import json
import re
import datetime

def index(request):
    models = get_models(get_app('tables'))
    context = {'models': {}}
    for model in models:
        context['models'].update({model.__name__: model._meta.verbose_name.title()})
    return render(request, 'tables/models.html', context)

def get_tables(request, model_name):
    model = get_model('tables', model_name)
    data = {}
    f_type = lambda x: re.search('.+\.(\w+Field)', str(type(x))).group(1)
    data['types'] = {field.name: f_type(field) for field in model._meta.fields}
    data['model'] = model_name
    data['names'] = [field.name for field in model._meta.fields]
    if request.method == 'GET':
        data['verbose_names'] = [field.verbose_name for field in model._meta.fields]
        data['values'] = list(model.objects.all().values())
        for i, d in enumerate(data['values']):
            for k, v in d.iteritems():
                if isinstance(v, datetime.date):
                    data['values'][i].update({k: str(v)})
        return HttpResponse(json.dumps(data),
                            content_type="application/json")

    elif request.method == 'POST':
        new_object_data = {}
        for k, v in request.REQUEST.iteritems():
            if k != 'csrfmiddlewaretoken':
                new_object_data.update(**{k: v})
        record = model.objects.create(**new_object_data)
        record.save()

        new_object_data.update(**{'id': record.id})
        data['value'] = new_object_data
        data['verbose_names'] = {field.name: field.verbose_name for field in model._meta.fields}
        return HttpResponse(json.dumps(data),
                            content_type="application/json")

def set_field(request, model_name, id_value):
    if request.method == 'POST':
        model = get_model('tables', model_name)
        field = model.objects.get(**{'id': id_value})
        body = request.POST
        key = body.keys()[0]
        setattr(field, key, body[key])
        field.save()
        return HttpResponse()

