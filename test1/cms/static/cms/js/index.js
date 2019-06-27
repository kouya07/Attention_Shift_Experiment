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

const log = document.getElementById('log');
let username, participant_number;
let time_log, judgment, temporary_time, hint;
let dateStr, mouse_pos, milliseconds;

function CursorLog(e, mouse_event) {
    judgment = '';
    time_log = '';
    mouse_pos = canvas.getPointer(e.e);

    const now = new Date();
    const dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss.SSS");
    milliseconds = new Date().getTime();
    dateStr = dateFormat.format(now);

    if(mouse_event == 'down') temporary_time = now;
    else if (mouse_event == 'up') MouseUp(now, temporary_time);
    else SendData();

    const text = document.createTextNode(now.toLocaleTimeString() + " mouse:" + mouse_event
        + " = {x = " + mouse_pos.x.toFixed(6)
        + ", y = " + mouse_pos.y.toFixed(6) + "} \u000a");
    log.insertBefore(text, log.firstChild);
}

//判定
function MouseUp(now, late) {
    time_log = (now - late)/ 1000;

    const active_obj = canvas.getActiveObject();
    // console.log(active_obj);

    if(active_obj != obj_A && active_obj != obj_B && active_obj != undefined) ChangeObj(active_obj);
    else if(active_obj == obj_B) {
        // 固定オブジェクト Fixed object Coordinate
        const c1 = obj_A.left + obj_A.width/2;
        const c2 = obj_A.top + obj_A.height/2;

        // 動く方のオブジェクト Moving object Coordinate
        const active_obj_w = active_obj.width/2 + active_obj.left;
        const active_obj_h = active_obj.height/2 + active_obj.top;

        // 一辺の長さ*0.1 Side length * 0.1
        const n1 = 0.1 * obj_length;

        // 2点間の距離 Distance between two points
        const D = Math.sqrt(Math.pow(active_obj_w-c1, 2) + Math.pow(active_obj_h-c2, 2));

        if(D <= n1 && obj_A.name === obj_B.name) {
            console.log(round_count, D, time_log, 'success');
            judgment = 'success';
            hint = correct;
        } else {
            console.log(round_count, D, time_log, 'failure');
            judgment = 'failure';
            hint = not_correct;
        }

        SendData();

        //ヒントを表示 Display hints
        if(hint_option) {
            canvas.add(hint);
            const timer = function () {
                canvas.remove(hint);
                canvas.clear();
                Init(); // Initialize
            };
            setTimeout(timer, 500); // 0.5秒間表示 Display for 0.5s
        } else {
            canvas.clear();
            Init(); // Initialize
        }
    }
}

//ユーザー情報を取得 Get user information
function User_info(){
    $.ajax({
        url: 'userinfo/',
        type: "GET",
        success: function(data) {
            username = data.user_name;
            participant_number = data.participant_number;
            hint_option =  Boolean(Number(data.hint_option));
            random_option = Boolean(Number(data.random_option));
            control_option = Boolean(Number(data.control_option));
            random_rate = data.random_rate;

            RoundArray();
            Init();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("user log error");
            // alert("XMLHttpRequest : " + XMLHttpRequest.status +  ", textStatus     : " + textStatus + ", errorThrown    : " + errorThrown.message);

        }
    });
}

// カーソルログ情報を送る Send cursor log information
function SendData() {
        const sendData = {
        'participant_number': participant_number, 'user_name': username, 'time': dateStr, 'mouse_event': mouse_event,
        'pointer_x': mouse_pos.x.toFixed(6),
        'pointer_y': mouse_pos.y.toFixed(6),
        'judgment': judgment, 's': time_log,
        'T1': obj_B.name, 'T2': obj_A.name,
        'round_count': round_count, 'time_ms': milliseconds
    };

    $.ajax({
        url: 'cursorlog/',
        type: "POST",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        timeout: 0,
        cache: false,
        data: $.toJSON(sendData),
        success: function () { },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("cursor log error");
            // alert("XMLHttpRequest : " + XMLHttpRequest.status +  ", textStatus     : " + textStatus + ", errorThrown    : " + errorThrown.message);
        }
    });
}
