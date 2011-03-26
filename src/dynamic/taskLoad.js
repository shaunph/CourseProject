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
            var date = new Date(); //date of task creation, created here to improve accuracy
	    var stat = 1; //status of task: 1 = new task, 0 = task already exists
            aTask = new task(parsed["tNom"].toString(), parsed["desc"].toString(), parsed["ETR"].toString(), 
			parsed["timeS"].toString(), parsed["priority"].toString(), 
				parsed["status"].toString(), parsed["uNom"].toString(), date);          

	    //checks the task table for a like-named task and collects its location if there
	    // makes use of example in documentation
	    db.getTable("task", function(obj) {
	        var n;
	        for (i = 0; i < obj.rows.length; i++) {
	            n = i;
	            if (obj.rows[i].taskName == aTask.getTaskName()){
	                stat = 0
	                break;
	            }
		}
	        if (stat == 1) { //if 1, then the task was not in the database

		    db.addTask(aTask); //only call if it is known there is no like task, possible to remove checking feature in SQLiteHelper

		    //dynamic pages based off example shown by Mitchel on the main site 
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

	        else { //otherwise, the name was taken and the stored task shown
		      //uses documented example from SQLiteHelper
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
