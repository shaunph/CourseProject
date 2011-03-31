/* modified version of mitchels example.js to view tasks */
var pagemaker = require('pagemaker');
var url = require('url');
var upops = require('uploadOps');
var db = require('SQLiteHelper');

exports.getReq = function (request,response) {
    send(response,url.parse(request.url,true).query);
}

send = function (response, parameters) {
    console.log(parameters[0]);
    var n = -1;
    try {
        db.getTable("task", function(obj) {
	    for(i = 0; i < obj.rows.length; i++) {
		for(var j in parameters) {
                    if (obj.rows[i].taskName == parameters[j]) {
	       	        n = i;
		        break;
	            }
		}
		if (n > -1) {
		    break;
		}
            }
	    if (n > -1) {
	        response.writeHead(200, {'Content-Type': 'text/html'});
                tPage = new StandardPage();
                tPage.setTitle('Post-Task Page');
                tPage.setContent("<h1> Found Task</h1> <br />");
                tPage.standardMenus();
                tPage.addContent("<div align='left'> Task Name: " + obj.rows[n].taskName + " <br /><br />");
                tPage.addContent("Description: " + obj.rows[n].description + " <br /><br />");
                tPage.addContent("Time Left: " + obj.rows[n].timeLeft + " <br /><br />");
                tPage.addContent("Time Spent: " + obj.rows[n].timeSpent + " <br /><br />");
                tPage.addContent("Priority: " + obj.rows[n].priority + " <br /><br />");
       	        tPage.addContent("Progress: " + obj.rows[n].progress + " <br /><br />");
	        tPage.addContent("Status: " + obj.rows[n].status + " <br /><br />");
	        tPage.addContent("Creator: " + obj.rows[n].user + " <br /><br />");
                tPage.addContent("<a href='index.html'><b>Back to Main</b></a> </div>");	
	        response.write(tPage.toHTML());
                response.end();
	    }
	    else {
	        response.writeHead(200, {'Content-Type': 'text/html'});
                tPage = new StandardPage();
                tPage.setTitle('Post-Task Page');
                tPage.setContent("<h1> Task Name Does not Exist</h1> <br />");
                tPage.standardMenus();
                tPage.addContent("<div align='left'> The name you entered is not the name of a current task. <br />");
	        tPage.addContent("<br /><a href='addtask.html'><b>Add The Task Now</b></a> <br />");
                tPage.addContent("<br /><a href='index.html'><b>Back to Main</b></a> </div>");	
	        response.write(tPage.toHTML());
                response.end();	
	    }
        });
    }
    
    catch (error) {
        // Log errors
        console.log("Error in taskView.js->send: " + error);
    }
    
}
