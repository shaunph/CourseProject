function loadTaskList(field, url) {
    $.get(url, function(data) {
        $('#' + field).html(data);
    });
}


loadTaskList('taskList', 'tasklist');
