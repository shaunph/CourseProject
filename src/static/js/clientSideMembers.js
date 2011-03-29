/**
 * Created by .
 * User: masudio
 * Date: 27/03/11
 * Time: 6:54 PM
 * To change this template use File | Settings | File Templates.
 */

/*

 */
function membersLoad(field, url) {
    $.get(url, function(data) {
        $('#' + field).html(data);
    });
}

function clearBox(field) {
    $('#' + field).val("");
}

membersLoad('membersList', 'members.js?');