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

$('button').click(function() {
    const participant_number = document.getElementById('participant_number').value;
    const user_name = document.getElementById('user_name').value;
    const q0 = document.getElementById('random').q0.value;
    const q1 = document.getElementById('hint_option').q1.value;
    const q2 = document.getElementById('random_option').q2.value;
    const q3 = document.getElementById('control_option').q3.value;
    const q4 = document.getElementById('block_number').q4.value;

    if(q0 !=='' && q1 !=='' && q2 !=='' && q3 !=='' && q4 !=='' && user_name !=='' && participant_number !=='') {
        location.href = '../index/';

        // 入力された情報をlog.txtに保存
        const sendData = {'participant_number': participant_number, 'user_name': user_name,
                        'random_rate': q0, 'hint_option': q1, 'random_option': q2, 'control_option': q3, 'block_number': q4};
        $.ajax({
            url: 'userlog/',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: $.toJSON(sendData),
            success: function() {
            },
            error: function() {
                alert("log error");
            }
        });
    } else alert("全て入力してください Please input all.");
});
