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

    var user;
    var cookies = upops.parseCookies(request.headers);
    if (cookies.Nickname != undefined) {
	user = cookies.Nickname;
    }
    else if (cookies.Email != undefined) {
	user = cookies.Email;
    }
    else {
	user = "User";
    }
	
    try {

        response.writeHead(200, {'Content-Type': 'text/html'});
        sPage = new StandardPage(request);
        sPage.setTitle('Search Results');
        sPage.setContent("<h1> Search Results </h1> <br />");
        sPage.standardMenus();
        sPage.addContent("<div align='left'> "+ user + "'s search is done. The search returned the following Tasks: <br /><br />");
	db.getTable("task", function(obj) {		    
            for(i=0; i<obj.rows.length; i++){
                if((obj.rows[i]) && (obj.rows[i].taskName.toLowerCase().indexOf(param["p1"].toString()) != -1)){			    
    	            sPage.addContent("<br /> <b><a href='/task?id="+obj.rows[i].taskid+"'>"+obj.rows[i].taskName+"</b></a> <br />");
                }
            }
	    sPage.addContent("</div>");
            response.write(sPage.toHTML());
            response.end(); 
        });

    } catch (error) {
        console.log(error);
    }
}
