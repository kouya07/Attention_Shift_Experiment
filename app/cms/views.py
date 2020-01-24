from .models import *
from django.http import *
from django.shortcuts import render
import json as simplejson
import ast
from datetime import datetime


def requested_cursorlog(request):
    data = simplejson.loads(request.body)
    print(data)

    model = CursorLog(participant_number=data[u'participant_number'], mouse_event=data[u'mouse_event'],
                      time=data[u'time'],time_ms=data[u'time_ms'], pointer_x=data[u'pointer_x'], pointer_y=data[u'pointer_y'],
                      judgment=data[u'judgment'], s=data[u's'], T1=data[u'T1'], T2=data[u'T2'], trial=data[u'trial_count'], trial_time_ms=data[u'trial_time_ms'],
                      trial_to_down=data[u'trial_to_down'], trial_to_up=data[u'trial_to_up'])
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


def user_info(request):
    with open('log.txt') as f:
        s = f.read()
        s = ast.literal_eval(s)

    return JsonResponse(s)


def log(request):
    with open('log.txt') as f:
        s = f.read()
        data = simplejson.dumps(s)
        data = simplejson.loads(data)
        data = ast.literal_eval(data)

        d = datetime.now().strftime("%Y/%m/%d %H:%M:%S")

    model = UserLog(participant_number=data[u'participant_number'], inconsistency=data[u'inconsistency'],
                    result_feedback=data[u'result_feedback'], memory_interference=data[u'memory_interference'], control_mode=data[u'control_mode'],
                    device=data[u'device'], block_number=data[u'block_number'], start_time=data[u'start_time'], end_time=d)
    model.save()

    return HttpResponse("success")


def login(request):
    return render(request, 'cms/login.html')


def index(request):
    return render(request, 'cms/index.html')
