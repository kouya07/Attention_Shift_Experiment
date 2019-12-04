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

$(function() {
    $('#q1-1').prop('checked', true);
    $('#q1-1').prop('disabled', true);
    $('#q1-1').next('label').css('color', '#bbbbbb');
    $('#q1-2').prop('disabled', true);
    $('#q1-2').next('label').css('color', '#bbbbbb');

    $('#q2-2').prop('checked', true);
    $('#q2-1').prop('disabled', true);
    $('#q2-1').next('label').css('color', '#bbbbbb');
    $('#q2-2').prop('disabled', true);
    $('#q2-2').next('label').css('color', '#bbbbbb');

    $('#q5').prop('disabled', true);
});

function OnButtonClick() {
    const participant_number = document.getElementById('participant_number').value;
    const q0 = document.form.elements['q0'].value;
    const q1 = document.form.elements['q1'].value;
    const q2 = document.form.elements['q2'].value;
    const q3 = document.form.elements['q3'].value;
    const q4 = document.form.elements['q4'].value;
    const q5 = document.form.elements['q5'].value;
    const now = new Date();
    const dateFormat = new DateFormat("yyyy/MM/dd HH:mm:ss");
    const dateStr = dateFormat.format(now);

    if (participant_number !=='') {
        const sendData = {'participant_number': participant_number, 'inconsistency': q0, 'result_feedback': q1, 'memory_interference': q2, 'control_mode': q3, 'device': q4, 'block_number': q5, 'start_time': dateStr};
        $.ajax({
            async: false,
            url: 'user_log/',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: $.toJSON(sendData),
            success: function() {
                location.href = '../index/';
            },
            error: function() {
                alert("log error");
            }
        });
    } else alert("全て入力してください Please input all.");
}