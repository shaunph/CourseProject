var dbHelper = require('./../js/SQLiteHelper'),
	task = require('./../static/js/task'),
	pagemaker = require('./../js/pagemaker'),
	url = require('url');

exports.getReq = function (request,response) {
	//saveTestTask();	// This will be removed once tasks can be saved

	var params = url.parse(request.url).query;
	var index = params.indexOf('=');
	loadTask(response, parseInt(params.substring(index+1)));
}

function displayTaskPage(response, id, taskValues) {
	page1 = new StandardPage();
	page1.setTitle(taskValues.getTaskName() + " Details");

	page1.setContent("<h3> Description <br /> </h3>");
	page1.addContent(taskValues.getDescription());

	page1.addContent("<h3> <br /> Priority <br /> </h3>");
	page1.addContent(taskValues.getPriority());

	page1.addContent("<h3> <br /> Status <br /> </h3>");
	page1.addContent(taskValues.getStatus());

	page1.addContent("<h3> <br /> User <br /> </h3>");
	page1.addContent(taskValues.getUser());

	page1.addContent("<h3> <br /> Date <br /> </h3>");
	page1.addContent(taskValues.getDate());
	
	page1.addMenuItem("Update Task", "/updatetask.html");
	page1.addMenuItem("home", "/index.html");

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(page1.toHTML());
	response.end();
}

function loadTask(response, id) {
	dbHelper.getTask(id, function(callbackObj) {
			var loadRow = callbackObj.rows[0];	// Always 0 because getTask only gets 1 row, namely the row with taskid = id
			var loadedTask = new task.Task(loadRow.taskName, loadRow.description, loadRow.priority, loadRow.status, loadRow.user, new Date(loadRow.date));
			displayTaskPage(response, id, loadedTask);
	});
}

// Saves a test task to the DB. Will be removed once tasks can be saved.
function saveTestTask() {
	var testTask = new task.Task("test name", "a description", "High", "Not started", "test@test.com", new Date());

	dbHelper.addTask(testTask, function(error) {});
}
