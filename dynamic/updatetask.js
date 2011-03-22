var	//db = require('SQLiteHelper'),
	task = require('task'),
	pagemaker = require('pagemaker'),
	url = require('url');

exports.getReq = function(request, response) {
	test(response);
	//loadTask(response, url.parse(request.url,true).query);
}

/* 
 * Takes in response and a task object as parameters.
 * Defines the response to be an html page and displays a form with fields where the task object's attributes are displayed.
 */
function displayUpdate(response, taskObj) {
	response.writeHead(200, {'Content-Type': 'text/html'});

	page1 = new StandardPage();
	page1.setTitle("Update Task");
	
	page1.setContent("Id: " + taskObj.getId() + "<br /><br />");
	page1.addContent("User: " + taskObj.getUser() + "<br /><br />");
	page1.addContent("Date: " + taskObj.getDate() + "<br /><br />");
	
	page1.addContent(
		"<form method=get action='update.js'>"+
			
			"<input type='hidden' name='id' value='"+taskObj.getId()+"'>"+
			
			"Name: "+
			"<input type='text' name='name' onclick='this.select()' value='"+taskObj.getTaskName()+"'><br /><br />"+
			
			"Status: "+
			"<input type='text' name='status' onclick='this.select()' value='"+taskObj.getStatus()+"'><br /><br />"+
			
			"Description:<br />"+
			"<textarea name='description' onclick='this.select()' rows='10' cols='85'>"+taskObj.getDescription()+"</textarea><br /><br />"+
			
			"Priority:"+
			"<input type='radio' name='level' value='low'"+checkPriority(taskObj,'low')+">Low "+
			"<input type='radio' name='level' value='medium'"+checkPriority(taskObj,'medium')+">Medium "+
			"<input type='radio' name='level' value='high'"+checkPriority(taskObj,'high')+">High <br /><br />"+
			
			"<input type='submit' name='changes' value='Submit Changes'>"+
			"<input type='button' name='' value='Change Estimate Values' onclick='parent.location=\'/\''>"+
			"<input type='button' value='Reset' onclick='history.go(0)'>"+
			"<input type='button' value='Go Back' onclick='history.go(-1);return true;'>"+

		"</form>"
	);
	
	page1.addContent(
		"<form method=post name=upform action='fileUpload/uploadFile.js' enctype='multipart/form-data'>"+
			"Attachment:"+
            "<input type='hidden' name='MAX_FILE_SIZE' value='500' />"+
            "<input type=file name=uploadfile>"+
			"<br />"+
			
			"<input type='button' name='Submit' value='Upload Attachment' onclick='LimitAttach(this.form, this.form.uploadfile.value)'>"+
		"</form>"
	);
	
	page1.addMenuItem("Home", "/");
	page1.addMenuItem("Display Task", "/taskpage?id=" + taskObj.getId());
	page1.addMenuItem("Task List", "/");
	
	response.write(page1.toHTML());
	response.end();
}

/* Checks if the current radio button matches the task's priority level. */
function checkPriority(taskObj, current) {
	if (taskObj.getPriority() == current)
		return " checked ";
}

/*
 * Loads a task
 */
function loadTask(response, param){
	db.getTask(param["id"], function(callback){
		var row = callback.row[0];
		var loadedTask = new task.Task(row.taskName, row.description, row.timeSpent, row.timeLeft, row.priority, row.status, row.user, row.date);
		displayUpdate(response, loadedTask);
	});
}

/* Test coding for a task object */
function test(response) {
	var taskObj = new task.task("taskName", "desc", "0", "0", "low", "status", "user", "date");
	displayUpdate(response, taskObj);
}
