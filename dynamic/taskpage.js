var dbHelper = require('SQLiteHelper'),
	task = require('task'),
	pagemaker = require('pagemaker'),
	url = require('url'),
	fs = require('fs'),
	util = require('util');

/*
 * Before linking to this page for the first time, uncomment saveTestTask() 
 * and comment out loadTask(response, parseInt(params.substring(index+1)))
 *
 * Once a task has been saved in your db, comment out saveTestTask(); and 
 * uncomment loadTask(response, parseInt(params.substring(index+1)))
 *
 * Click on the link to this page again.
 * The task page should now be displayed successfully.
 */
	
	
exports.getReq = function (request,response) {
	//saveTestTask();	// This will be removed once tasks can be saved

	var params = url.parse(request.url).query;
	var index = params.indexOf('=');
	loadTask(request, response, parseInt(params.substring(index+1)));
}

function displayTaskPage(response, id, taskValues) {
	var taskPage = new StandardPage();
	taskPage.setTitle(taskValues.getTaskName() + " Details");
	
	taskPage.setContent("<h3>Description</h3>");
	taskPage.addContent(taskValues.getDescription());
	
	taskPage.addContent("<h3>Priority</h3>");
	taskPage.addContent(taskValues.getPriority());

	taskPage.addContent("<h3>Progress</h3>");
	taskPage.addContent(taskValues.getProgress());
	
	taskPage.addContent("<h3>Status</h3>");
	taskPage.addContent(taskValues.getStatus());

	taskPage.addContent("<h3>User</h3>");
	taskPage.addContent(taskValues.getUser());
	
	// TODO : Disable this link if task status is marked as closed
	taskPage.addMenuItem("Update Task", "/updatetask.html");
	taskPage.addMenuItem("home", "/index.html");

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(taskPage.toHTML());
	response.end();
}

function loadTask(request, response, id) {
	dbHelper.getTask(id, function(callbackObj) {
			var loadRow = callbackObj.rows[0];	// Always 0 because getTask only gets 1 row, namely the row with taskid = id
			if (loadRow == undefined) {	// If task doesn't exist in db
				var errorPage = process.cwd() + "/static/error_pages/404.html"; 
				pagemaker.ParsePage(errorPage, function (html) {
					response.end(html);
				});
				return;
			}
			var loadedTask = new task.task(loadRow.taskName, loadRow.description, loadRow.timeSpent, loadRow.timeLeft, 
											loadRow.priority, loadRow.progress, loadRow.status, loadRow.user);
			displayTaskPage(response, id, loadedTask);
	});
}

// Saves a test task to the DB. Will be removed once tasks can be saved.
function saveTestTask() {
	var testTask = new task.task("test name", "a description", "0", "0", "High", "Not started", "Open", "test@test.com");

	dbHelper.addTask(testTask, function(error) {return;});
}
