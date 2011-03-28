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
        } else {
             searchTerm = parameters['searchTerm'].toLowerCase(); // search
        }

        // create table headings
        var membersPage = "";
        membersPage = membersPage.concat("<h3><table border=\"1\"><tr>" +
                "<td><span style=\"color: #000000; \">Member E-mail</td>" +
                "<td><span style=\"color: #000000; \">Member Nickname</td>" +
                "<td><span style=\"color: #000000; \">Member Password (useful for testing?)</td>" +
                "</tr></h3>");

        for(i = 0; i < obj.rows.length; i++) {

            rowEmail = obj.rows[i].email.toLowerCase();
            rowNickname = obj.rows[i].nickname.toLowerCase();

            if(rowEmail.indexOf(searchTerm) != -1 || rowNickname.indexOf(searchTerm) != -1) {
                membersPage = membersPage.concat("<tr>" +
                        "<td><span style=\"color: #000000; \">" + obj.rows[i].email + "</td>" +
                        "<td><span style=\"color: #000000; \">" + obj.rows[i].nickname + "</td>" +
                        "<td><span style=\"color: #000000; \">" + obj.rows[i].password + "</td>" +
                        "</tr>");
            }
        }

        membersPage = membersPage.concat("</table>");

        response.write(membersPage);
        response.end();
    });
}
