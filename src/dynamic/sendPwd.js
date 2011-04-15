/* 
Author of original code: Mitchell Ludwig

This is a modified version of the file upload code by Mitchell used to store tasks in the database (changed by Justin Kelly)
*/

var upops = require('uploadOps');
var pagemaker = require('pagemaker');
var db = require('SQLiteHelper');
var url = require('url');

exports.getReq = function (request, response, dataBuffer) {
    search(request, response, (url.parse(request.url,true).query));
} 

search = function (request, response, param) {

    var user = "noManIsAnIsland";
    var pass;
    try {

        response.writeHead(200, {'Content-Type': 'text/html'});
        sPage = new StandardPage(request);
        sPage.setTitle('Results');
        sPage.setContent("<h1> Results </h1> <br />");
        sPage.standardMenus();
	db.getTable("user", function(obj) {
            for(i=0; i<obj.rows.length; i++){
                if((obj.rows[i]) && (obj.rows[i].email == param["p1"])){
		    console.log(obj.rows[i].email);
    	            user = obj.rows[i].email;
                    pass = obj.rows[i].password;
                }
            }
            if (user != "noManIsAnIsland") {
                sPage.addContent("your password has been found, TODO: send it via email");
            }
            else {
                sPage.addContent("Entered email not found");
            }
	    sPage.addContent("</div>");
            response.write(sPage.toHTML());
            response.end(); 
        });

    }
    catch (error) {
        console.log(error);
    }
}
