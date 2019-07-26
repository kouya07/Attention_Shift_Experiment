from .models import *
from django.http import *
from django.shortcuts import render
import json as simplejson
import ast


def requested_cursorlog(request):
    data = simplejson.loads(request.body)
    print(data)

    model = CursorLog(participant_number=data[u'participant_number'], mouse_event=data[u'mouse_event'],
                      time=data[u'time'],time_ms=data[u'time_ms'], pointer_x=data[u'pointer_x'], pointer_y=data[u'pointer_y'],
                      judgment=data[u'judgment'], s=data[u's'], T1=data[u'T1'], T2=data[u'T2'], round=data[u'round_count'])
    model.save()

    return HttpResponse("success")


def requested_userlog(request):
    data = str(simplejson.loads(request.body))
    path_w = 'log.txt'
    with open(path_w, mode='w') as f:
        f.write(data)
    with open(path_w) as f:
        print(f.read())

    return HttpResponse("success")


def userinfo(request):
    with open('log.txt') as f:
        s = f.read()
        data = simplejson.dumps(s)
        data = simplejson.loads(data)
        data = ast.literal_eval(data)
        s = ast.literal_eval(s)

    model = UserLog(participant_number=data[u'participant_number'], inconsistency=data[u'inconsistency'],
                    result_feedback=data[u'result_feedback'], memory_interference=data[u'memory_interference'], control_mode=data[u'control_mode'],
                    device=data[u'device'], block_number=data[u'block_number'])
    model.save()

    return JsonResponse(s)


def login(request):
    return render(request, 'cms/login.html')


def index(request):
    return render(request, 'cms/index.html')
