var dbHelper = require('./../js/SQLiteHelper'),
	task = require('./../static/js/task'),
	pagemaker = require('./../js/pagemaker'),
	url = require('url');

// Important Note: Until a save function is implemented, I made a temporary
// saveTestTask() function. To run this for the first time, follow these steps:
//		1) Create the database
//		2) Connect to the server and click on Task Page
//		3) Comment out saveTestTask() and uncomment loadTask(response, parseInt(params.substring(index+1)));
//		4) Connect to the server and click on Task Page
//		
//		or alternatively:
//		1) Create the database
//		2) In the terminal: sqlite3 db/main.db
//		3) Add tasks manually to the task table
//		4) Comment out saveTestTask() and uncomment loadTask(response, parseInt(params.substring(index+1)));
//		5) Connect to the server and click on Task Page 

exports.getReq = function (request,response) {
	//saveTestTask();	// This will be removed once tasks can be saved

	var params = url.parse(request.url).query;
	var index = params.indexOf('=');
	loadTask(response, parseInt(params.substring(index+1)));
}

function displayTaskPage(response, id, taskValues) {
	var taskPage = new StandardPage();
	taskPage.setTitle(taskValues.getTaskName() + " Details");
	
	taskPage.setContent("<h3> Description <br /> </h3>");
	taskPage.addContent(taskValues.getDescription());
	
	taskPage.addContent("<h3> <br /> Priority <br /> </h3>");
	taskPage.addContent(taskValues.getPriority());

	taskPage.addContent("<h3> <br /> Progress <br /> </h3>");
	taskPage.addContent(taskValues.getProgress());
	
	taskPage.addContent("<h3> <br /> Status <br /> </h3>");
	taskPage.addContent(taskValues.getStatus());

	taskPage.addContent("<h3> <br /> User <br /> </h3>");
	taskPage.addContent(taskValues.getUser());
	
	// TODO : Disable this link if task is marked as closed
	taskPage.addMenuItem("Update Task", "/updatetask.html");
	taskPage.addMenuItem("home", "/index.html");

	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(taskPage.toHTML());
	response.end();
}

function loadTask(response, id) {
	dbHelper.getTask(id, function(callbackObj) {
			var loadRow = callbackObj.rows[0];	// Always 0 because getTask only gets 1 row, namely the row with taskid = id
			var loadedTask = new task.Task(loadRow.taskName, loadRow.description, loadRow.priority, loadRow.progress, loadRow.status, loadRow.user);
			displayTaskPage(response, id, loadedTask);
	});
}

// Saves a test task to the DB. Will be removed once tasks can be saved.
function saveTestTask() {
	var testTask = new task.Task("test name", "a description", "High", "Not started", "Open", "test@test.com");

	dbHelper.addTask(testTask, function(error) {});
}
