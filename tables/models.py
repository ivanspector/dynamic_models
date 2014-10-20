from django.db import models

import yaml
import os

dir = os.path.dirname(__file__)

path = os.path.join(dir, 'config.yaml')

config = yaml.load(file(path))


type_dict = {'char': 'CharField',
             'int': 'IntegerField',
             'date': 'DateField'}

max_length = {'max_length': 20}

for class_name in config:
    fields = {}
    config_fields = config[class_name]['fields']
    for field in config_fields:
        f_id = field['id']
        f_title = field['title']
        f_type = field['type']
        fields.update({f_id: getattr(models, type_dict[f_type])(f_title, **max_length if f_type == 'char' else {})})
    fields.update({'Meta': type('Meta', (object,), {'verbose_name': config[class_name]['title']})})
    fields.update({'__module__': __name__})
    type(class_name, (models.Model,), fields)

