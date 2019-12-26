const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

const page = document.getElementById("page");
const log = document.getElementById('log');
const canvas_box = document.getElementById('canvas_box');
let participant_number;
let time_log, judgment, temporary_time, hint;
let dateStr, mouse_pos, milliseconds;
let diffTime, diffMilliseconds, pastTime = 0;
let canvas_pos;

function CursorLog(e, mouse_event) {
    judgment = '';
    time_log = '';
    mouse_pos = canvas.getPointer(e.e);
    canvas_pos = $('canvas').offset();

    const now = new Date();
    const dateFormat = new DateFormat("yyyy_MM_dd HH:mm:ss.SSS");
    milliseconds = new Date().getTime();
    dateStr = dateFormat.format(now);

    if(pastTime === 0) pastTime = now.getTime();

    diffTime = now.getTime() - pastTime;
    diffMilliseconds = diffTime;
    pastTime = now.getTime();

    switch (mouse_event) {
        case 'down':
            temporary_time = now;
            break;

        case 'up':
            MouseUp(now, temporary_time);
            break;
    }

    SendData();

    // const text = document.createTextNode(now.toLocaleTimeString() + " mouse:" + mouse_event
    //     + " = {x = " + mouse_pos.x.toFixed(0) + ", y = " +  mouse_pos.y.toFixed(0) + "} \u000a");
    // log.insertBefore(text, log.firstChild);
}

function MouseUp(now, old) {
    const active_obj = canvas.getActiveObject();

    if (active_obj != undefined && !active_obj.name.indexOf("select_obj_")) ChangeObj(active_obj);
    else if ((active_obj == obj_B || active_obj == slider) && active_obj != undefined) {
        time_log = (now - old)/ 1000;

        if (!control_option && active_obj == obj_B) {
            // console.log(trial_count, time_log, 'mode-error');
            judgment = 'mode-error';
            hint = error;
        } else {
            const c1 = obj_A.left + obj_A.width / 2;
            const c2 = obj_A.top + obj_A.height / 2;

            const active_obj_w = obj_B.width / 2 + obj_B.left;
            const active_obj_h = obj_B.height / 2 + obj_B.top;

            const n = 0.1 * obj_length;

            // 2点間の距離 Distance between two points
            const D = Math.sqrt(Math.pow(active_obj_w - c1, 2) + Math.pow(active_obj_h - c2, 2));

            if (D <= n && obj_A.name === obj_B.name) {
                // console.log(trial_count, D, time_log, 'success');
                judgment = 'success';
                hint = correct;
            } else {
                // console.log(trial_count, D, time_log, 'error-inaccurate');
                judgment = 'error-inaccurate';
                hint = not_correct;
            }
        }

        if (hint_option) canvas.add(hint);

        const timer1 = function () {
            canvas.clear();
            canvas_box.style.border = "0px solid";
            canvas.add(gazing_point);
            setTimeout(timer2, 2500); // Display for 2.5s
        };

        const timer2 = function () {
            canvas.clear();
            Init();
            canvas_box.style.border = "1px solid";
        };

        setTimeout(timer1, 700); // Display for 0.7s
    }
}

function User_info(){
    $.ajax({
        async: false,
        url: 'user_info/',
        type: "GET",
        success: function(data) {
            participant_number = data.participant_number;
            random_rate = data.inconsistency;
            hint_option =  Boolean(Number(data.result_feedback));
            random_option = Boolean(Number(data.memory_interference));
            control_option = Boolean(Number(data.control_mode));

            if (!control_option) {
                left_limit = bar_frame.left;
                frame_limit = 50;
            }

            canvas.add(gazing_point);

            const timer = function () {
                canvas.remove(gazing_point);
                TrialArray();
                Init();
                canvas_box.style.border = "1px solid";
            };

            setTimeout(timer, 3000); // Display for 3.0s

        },
        error: function() {
            alert("user log error");
        }
    });
}

function SendData() {
    const pointer_x =  canvas_pos.left + mouse_pos.x;
    const pointer_y = canvas_pos.top + mouse_pos.y;
    const sendData = {
        'participant_number': participant_number, 'time': dateStr, 'mouse_event': mouse_event,
        'pointer_x': pointer_x, 'pointer_y': pointer_y,
        'judgment': judgment, 's': time_log, 'T1': obj_B.name, 'T2': obj_A.name,
        'trial_count': trial_count, 'time_ms': milliseconds, 'trial_time_ms': diffMilliseconds
    };

    $.ajax({
        url: 'cursor_log/',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        timeout: 0,
        cache: false,
        data: $.toJSON(sendData),
        success: function () { },
        error: function () {
            // alert("cursor log error");
        }
    });
}

function logout() {
    page.style.display = "none";

    $.ajax({
        url: 'log/',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        timeout: 0,
        cache: false,
        success: function () {
            alert("終了 Thank you.");
            location.href = '../login/';
        },
        error: function () {
            // alert("cursor log error");
        }
    });
}