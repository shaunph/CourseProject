function change(field, url) {
    $.get(url, function(data) {
    $('#'+field).html(data);
    });
}
