/**
 * Created by .
 * User: masudio
 * Date: 11/03/11
 * Time: 11:09 PM
 */

url = require('url');
slh = require('SQLiteHelper');
pagemaker = require('pagemaker');

/**
 * 
 * @param request
 * @param response
 */
exports.getReq = function(request, response) {

    var parameters = url.parse(request.url,true).query;
    loadMembers(parameters, response);
}

/**
 *
 * @param parameters
 * @param response
 */
function loadMembers(parameters, response) {

    response.writeHead(200, {'Content-Type' : 'text/html'});

    console.log("Getting table...");

    slh.getTable("user", function(obj) {
        if(obj.status != 0) {
            console.log("error getting user table: " + obj.detail);
            return;
        }

        console.log("Table retrieved.");

        var searchTerm;
        var rowEmail;
        var rowNickname;

        // check if this is a search or a pageload/refresh
        if(parameters['searchTerm'] == undefined) {
            searchTerm = ""; //pageload/refresh
        } else if(parameters['caseCheckBox'] == 'on') {
            searchTerm = parameters['searchTerm']; // search case sensitive
        } else {
             searchTerm = parameters['searchTerm'].toLowerCase(); // search case INsensitive
        }

        // create table headings
        var membersPage = "";
        membersPage = membersPage.concat("<h3>" +
                "<div class='row'>" +
                "<div class='membersHeading'>Member E-mail</div>" +
                "<div class='membersHeading'>Member Nickname</div>" +
                "<div class='membersHeading'>Member Password (useful for testing?)</div>" +
                "</h3></div>");

        for(i = 0; i < obj.rows.length; i++) {

            if(parameters['caseCheckBox'] == 'on') {
                rowEmail = obj.rows[i].email;
                rowNickname = obj.rows[i].nickname;
            } else {
                rowEmail = obj.rows[i].email.toLowerCase();
                rowNickname = obj.rows[i].nickname.toLowerCase();
            }

            if(rowEmail.indexOf(searchTerm) != -1 || rowNickname.indexOf(searchTerm) != -1) {
                membersPage = membersPage.concat("<div class='row'>" +
                        "<div class='membersEntry'>" + obj.rows[i].email + "</div>" +
                        "<div class='membersEntry'>" + obj.rows[i].nickname + "</div>" +
                        "<div class='membersEntry'>" + obj.rows[i].password + "</div>" +
                        "</div>");
            }
        }


        response.write(membersPage);
        response.end();
    });
}
