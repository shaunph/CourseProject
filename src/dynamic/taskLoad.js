/* 
Author of original code: Mitchell Ludwig

This is a modified version of the file upload code by Mitchell used to store tasks in the database (changed by Justin Kelly)
*/

var upops = require('uploadOps');
var pagemaker = require('pagemaker');
var url = require('url');
  
/*
Tries to store task in the database. After, redirect to main page
TODO: redirect to dynamic task display page
*/
exports.postReq = function (request, response) {
    var aTask;
    var allChunks = [];
    var chunkCount = 0;
    var bops = require('bufferOps.js'); //Useful operations on Buffer objects
    var db = require('SQLiteHelper');
    var tsk = require('task');
    //Record all received chunks
    request.on('data', function (chunk) {
        allChunks[chunkCount] = chunk;
        chunkCount++;
    });
    //Once everything is received
    request.on('end', function () {
        //Make one huge data Buffer that holds the entire HTTP request data section
        var dataBuffer = bops.join(allChunks);
        //Extract the file from the data Buffer.
        try {
            var parsed = upops.parseMultipartFormdata(dataBuffer);
            var date = new Date();
	    var stat = 1;
            aTask = new task(parsed["tNom"].toString(), parsed["desc"].toString(), parsed["ETR"].toString(), 
			parsed["timeS"].toString(), parsed["priority"].toString(), 
				parsed["status"].toString(), parsed["uNom"].toString(), date);          

	    db.getTable("task", function(obj) {
	        var n;
	        for (i = 0; i < obj.rows.length; i++) {
	            n = i;
	            if (obj.rows[i].taskName == aTask.getTaskName()){
	                stat = 0
	                break;
	            }
		}
	        if (stat == 1) {

		    db.addTask(aTask);

	            response.writeHead(200, {'Content-Type': 'text/html'});
	            tPage = new StandardPage();
	            tPage.setTitle('Post-Task Page');
 	            tPage.setContent("<h1> THE FOLLOWING TASK WAS ADDED </h1> <br />");
	            tPage.standardMenus();
	            tPage.addContent("Task Name: " + aTask.getTaskName() + " <br /><br />");
	            tPage.addContent("Description: " + aTask.getDescription() + " <br /><br />");
	            tPage.addContent("Time Spent: " + aTask.getTimeSpent() + " <br /><br />");
	            tPage.addContent("Time Left: " + aTask.getTimeLeft() + " <br /><br />");
	            tPage.addContent("Priority: " + aTask.getPriority() + " <br /><br />");
	            tPage.addContent("Status: " + aTask.getStatus() + " <br /><br />");
	            tPage.addContent("<a href='index.html'><b>Back to Main</b></a>");	
	            response.write(tPage.toHTML());
                    response.end(); 
	        }

	        else {

	            response.writeHead(200, {'Content-Type': 'text/html'});
	            tPage = new StandardPage();
	            tPage.setTitle('Post-Task Page');
 	            tPage.setContent("<h1> THE TASK NAME WAS TAKEN </h1> <br />");
	            tPage.standardMenus();
		    tPage.addContent("<b>This is the task currently in the database:</b> <br /><br />");
	            tPage.addContent("Task Name: " + obj.rows[n].taskName + " <br /><br />");
	            tPage.addContent("Description: " + obj.rows[n].description + " <br /><br />");
	            tPage.addContent("Time Spent: " + obj.rows[n].timeLeft + " <br /><br />");
	            tPage.addContent("Time Left: " + obj.rows[n].timeSpent + " <br /><br />");
	            tPage.addContent("Priority: " + obj.rows[n].priority + " <br /><br />");
	            tPage.addContent("Status: " + obj.rows[n].status + " <br /><br />");
	            tPage.addContent("Creator: " + obj.rows[n].user + " <br /><br />");
	            tPage.addContent("Date Made: " + obj.rows[n].date + " <br /><br />");
	            tPage.addContent("<a href='index.html'><b>Back to Main</b></a>");	
	            response.write(tPage.toHTML());
                    response.end();
	        }
	    });   

        } catch (error) {
            //Log errors
            console.log("Error in taskLoad.js->postReq: " + error);
        }
    });
	
};
