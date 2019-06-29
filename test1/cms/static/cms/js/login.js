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

function OnButtonClick() {
    const participant_number = document.getElementById('participant_number').value;
    const user_name = document.getElementById('user_name').value;
    const q0 = document.form.elements['q0'].value;
    const q1 = document.form.elements['q1'].value;
    const q2 = document.form.elements['q2'].value;
    const q3 = document.form.elements['q3'].value;
    const q4 = document.form.elements['q4'].value;
    const q5 = document.form.elements['q5'].value;

    if(q0 !=='' && q1 !=='' && q2 !=='' && q3 !=='' && q4 !=='' && q5 !=='' && user_name !=='' && participant_number !=='') {
        location.href = '../index/';

        const sendData = {'participant_number': participant_number, 'user_name': user_name,
                        'random_rate': q0, 'hint_option': q1, 'random_option': q2, 'control_option': q3, 'device': q4, 'block_number': q5};
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
}
