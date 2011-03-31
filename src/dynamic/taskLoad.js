/* 
Author of original code: Mitchell Ludwig

This is a modified version of the file upload code by Mitchell used to store tasks in the database (changed by Justin Kelly)
*/

var upops = require('uploadOps');
var pagemaker = require('pagemaker');
var bops = require('bufferOps.js'); //Useful operations on Buffer objects
var db = require('SQLiteHelper');
var tsk = require('task');
  
/*
Tries to store task in the database. After, redirect to main page
TODO: redirect to dynamic task display page
*/
exports.postReq = function (request, response) {
    var aTask;
    var allChunks = [];
    var chunkCount = 0;
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
            aTask = new tsk.task(parsed["tNom"].toString(), parsed["desc"].toString(), parsed["timeS"].toString(), 
			parsed["ETR"].toString(), parsed["priority"].toString(), 
				parsed["prog"].toString(), "Open", parsed["uNom"].toString());          

	    //checks the task table for a like-named task and collects its location if there
	    // makes use of example in documentation
	    db.getTable("task", function(obj) {
	
 	        db.addTask(aTask, function(status) {
	            if (status == -1) { //if -1, then the task was not in the database

		        //dynamic pages based off example shown by Mitchel on the main site 
	                response.writeHead(200, {'Content-Type': 'text/html'});
	                tPage = new StandardPage();
	                tPage.setTitle('Post-Task Page');
 	                tPage.setContent("<h1> THE FOLLOWING TASK WAS ADDED </h1> <br />");
	                tPage.standardMenus();
	                tPage.addContent("<div align='left'> Task Name: " + aTask.getTaskName() + " <br /><br />");
	                tPage.addContent("Description: " + aTask.getDescription() + " <br /><br />");
	                tPage.addContent("Time Left: " + aTask.getTimeLeft() + " <br /><br />");
	                tPage.addContent("Time Spent: " + aTask.getTimeSpent() + " <br /><br />");
	                tPage.addContent("Priority: " + aTask.getPriority() + " <br /><br />");
		        tPage.addContent("Progress: " + aTask.getProgress() + " <br /><br />");
	                tPage.addContent("Status: " + aTask.getStatus() + " <br /><br />");
	                tPage.addContent("<a href='index.html'><b>Back to Main</b></a> </div>");
			tPage.addContent("<br /><a href='/viewTask.js?param1=" + aTask.getTaskName() + "'><b>Look up Task</b></a>");	
	                response.write(tPage.toHTML());
                        response.end(); 
	            }

	            else { //otherwise, the name was taken and the stored task shown

	                response.writeHead(200, {'Content-Type': 'text/html'});
	                tPage = new StandardPage();
	                tPage.setTitle('Post-Task Page');
 	                tPage.setContent("<h1> THE TASK NAME WAS TAKEN </h1> <br />");
	                tPage.standardMenus();
		        tPage.addContent("<b>This is the task currently in the database:</b> <br /><br />");
	                tPage.addContent("<div align='left'> Task Name: " + obj.rows[status].taskName + " <br /><br />");
	                tPage.addContent("Description: " + obj.rows[status].description + " <br /><br />");
	                tPage.addContent("Time Left: " + obj.rows[status].timeLeft + " <br /><br />");
	                tPage.addContent("Time Spent: " + obj.rows[status].timeSpent + " <br /><br />");
	                tPage.addContent("Priority: " + obj.rows[status].priority + " <br /><br />");
			tPage.addContent("Progress: " + obj.rows[status].progress + " <br /><br />");
	                tPage.addContent("Status: " + obj.rows[status].status + " <br /><br />");
	                tPage.addContent("Creator: " + obj.rows[status].user + " <br /><br />");
	                tPage.addContent("<a href='index.html'><b>Back to Main</b></a> </div>");	
	                response.write(tPage.toHTML());
                        response.end();
	            }
		});
	    });   

        } catch (error) {
            //Log errors
            console.log("Error in taskLoad.js->postReq: " + error);
        }
    });
	
};
