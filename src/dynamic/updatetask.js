var db = require('SQLiteHelper'),
    task = require('task').task,
    pagemaker = require('pagemaker'),
    url = require('url');

exports.getReq = function(request, response) {
    loadTask(request, response, url.parse(request.url,true).query);
}

/* 
 * Takes in response and a task object as parameters.
 * Defines the response to be an html page and displays a form with fields where the task object's attributes are displayed.
 */
function displayUpdate(request, response, id, taskObj) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    page = new StandardPage(request);
    page.setTitle("Update Task");

    page.setContent("User: " + taskObj.getUser() + "<br /><br />");
    page.addContent("Date: " + taskObj.getDate() + "<br /><br />");
    page.addContent("Name: " + taskObj.getTaskName() + "<br /><br />");

    page.addContent(
        "<form method=post action='update' enctype='multipart/form-data'>"+

            "<input type='hidden' name='id' value='"+id+"'>"+
            "<input type='hidden' name='name' value='"+taskObj.getTaskName()+"'>"+

            "Status: <br />"+
            "<input type='radio' name='status' value='Open'"+checkStatus(taskObj,'Open')+"'>Open "+
            "<input type='radio' name='status' value='Closed'"+checkStatus(taskObj,'Closed')+"'>Closed <br /><br />"+

            "Progress: "+
            "<input type='text' name='progress' value='"+taskObj.getProgress()+"'><br /><br />"+

            "Description:<br />"+
            "<textarea name='description' rows='10' cols='85'>"+taskObj.getDescription()+"</textarea><br /><br />"+
            "<input type='hidden' name='oDescription' value='"+taskObj.getDescription()+"'>"+

            "Priority:<br />"+
            "<input type='radio' name='level' value='Low'"+checkPriority(taskObj,'Low')+">Low "+
            "<input type='radio' name='level' value='Medium'"+checkPriority(taskObj,'Medium')+">Medium "+
            "<input type='radio' name='level' value='High'"+checkPriority(taskObj,'High')+">High <br /><br />"+

            "<input type='submit' name='changes' value='Submit Changes'>"+
            "<input type='button' name='' value='Change Estimate Values' onclick='parent.location=\'/\''>"+
            "<input type='button' value='Go Back' onclick='history.go(-1);return true;'>"+

        "</form>"
    );

    page.addContent(
        "<form method=post name=upform action='fileUpload/uploadFile' enctype='multipart/form-data'>"+
            "Attachment:"+
            "<input type='hidden' name='MAX_FILE_SIZE' value='500' />"+
            "<input type=file name=uploadfile>"+
            "<br />"+

            "<input type='button' name='Submit' value='Upload Attachment' onclick='LimitAttach(this.form, this.form.uploadfile.value)'>"+
        "</form>"
    );

    page.standardMenus();

    response.write(page.toHTML());
    response.end();
}

/* Checks if the current radio button matches the task's status. */
function checkStatus(taskObj, current) {
    if (taskObj.getStatus() == current) {
        return " checked ";
    }
}

/* Checks if the current radio button matches the task's priority level. */
function checkPriority(taskObj, current) {
    if (taskObj.getPriority() == current)
        return " checked ";
}

/*
 * Loads a task
 */
function loadTask(request, response, param){
    db.getTask(param["id"], function(callback){
        try {
            var row = callback.rows[0];
			if (row.status !== "Closed") {
				var loadedTask = new task(row.taskName, row.description, row.timeSpent, row.timeLeft, row.priority, row.progress, row.status, row.user);
           		displayUpdate(request, response, param["id"], loadedTask);
			} else {
				message(request, response, param["id"]);
			}
        } catch (e) {
            message(request, response);
		}
    });
}

/*
 * Sends a temporary page that indicates what's wrong
 */
message = function(request, response, id) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
	
    page = new StandardPage(request);
	page.setTitle("Update Task");
	page.standardMenus();

	if (id) {	// If id is not undefined
   		page.setContent("This task is closed and not available for update.");
		
    	response.write(page.toHTML());
    	response.end();
	} else {
    	page.setContent("Please indicate a valid id in the url.");

	    response.write(page.toHTML());
    	response.end();
	}
}