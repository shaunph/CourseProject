/**
 * Created by .
 * User: masudio
 * Date: 11/03/11
 * Time: 11:09 PM
 */

var basepath = "../";
var slh = require(basepath + "js/SQLiteHelper.js");
var pagemaker = require(basepath + "js/pagemaker.js");

exports.getReq = function(request, response) {
    console.log("IN HEREEEEEEEwherwhe;alhtEEEE");
    slh.getTable("user", function(obj) {
        if(obj.status != 0) {
            console.log("error getting user table: " + obj.detail);
            return;
        }

    console.log("IN HEREEEEEEEEEEE");
        var membersPage = new pagemaker.StandardPage();
        membersPage.setTitle("Members");

        membersPage.addContent("<h3>");
        for(i = 0; i < obj.rows.length; i++) {
            if(i == 0) {
                membersPage.addContent("<table border=\"1\">");
            }

            membersPage.addContent("<tr>" +
                    "<td><span style=\"color: #000000; \">" + obj.rows[i].email + "</td>" +
                    "<td><span style=\"color: #000000; \">" + obj.rows[i].nickname + "</td>" +
                    "<td><span style=\"color: #000000; \">" + obj.rows[i].password + "</td>" +
                    "</tr>");

            if(i ==obj.rows.length - 1) {
                membersPage.addContent("</table");
            }
        }
        membersPage.addContent("</h3>");
console.log(membersPage.toHTML());
        response.write(membersPage.toHTML());
        response.end();
    });
}