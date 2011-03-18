var db = require('./../js/SQLiteHelper'),
	task = require('./../static/js/task'),
	pagemaker = require('./../js/pagemaker'),
	url = require('url');

exports.getReq = function(request, response) {
	var params = url.parse(request.url).query;
	test(response);
	// loadTask(response, ''); once there are tasks available
}

/* 
 * Takes in response and a task object as parameters.
 * Defines the response to be an html page and displays a form with fields where the task object's attributes are displayed.
 */
function displayUpdate(response, taskObj) {
	response.writeHead(200, {'Content-Type': 'text/html'});

	page1 = new StandardPage();
	page1.setTitle("Update " + taskObj.getTaskName());
	
	page1.setContent("<h1>Update</h1>");
	
	page1.setContent("User: ");
	page1.addContent(taskObj.getUser());
	
	page1.setContent("Date: ");
	page1.addContent(taskObj.getDate());
	
	page1.setContent(
		"<form method=post name=upform action='/profile/uploadPic.js' enctype='multipart/form-data'>"+
			
			"Status:<br />"+
			"<input type='text' id='inputStatus' value=''><br /><br />"+
			
			"Description:<br />"+
			"<textarea id='inputDescription' rows='10' cols='85'></textarea> <br /><br />"+
			
			"Priority:"+
			"<input type='radio' name='level' value='low'>Low "+
			"<input type='radio' name='level' value='medium'>Medium "+
			"<input type='radio' name='level' value='high'>High <br /><br />"+
			
			"Attachment:"+
            "<input type='hidden' name='MAX_FILE_SIZE' value='500' />"+
            "<input type=file name=uploadfile>"+
            "<br /><br />"+
			
			"<input type='button' name='Submit' value='Submit Changes' onclick='update()/*;LimitAttach(this.form, this.form.uploadfile.value)*/'>"+
			"<input type='button' name='' value='Change Estimate Values' onclick='parent.location=\'#\''>"+
			"<input type='button' value='Reset' onclick='setInput()'>"+
			"<input type='button' value='Go Back' onclick='history.go(-1);return true;'>"+

		"</form>"
	);
	
	page1.addContent(setInput());
	
	page1.addMenuItem("Home", "/index.html");
	page1.addMenuItem("Display Task", "");
	page1.addMenuItem("Task List", "");
	
	response.write(page1.toHTML());
	response.end();
}

/* 
 * Takes in id string and the name of the wanted task object attribute.
 * Sets the value of the input's value as the attribute.
 */
function inputDisplay(id, name) {
	var displayValue;
	switch(name) {
		case "taskName":
			displayValue = taskObj.getTaskName();
			break;
		case "description":
			displayValue = taskObj.getDescription();
			break;
		case "status":
			displayValue = taskObj.getStatus();
			break;
		default:
			alert("Invalid Name");
			return;
	}
	document.getElementById(id).value = displayValue;
}

/* Checks the corresponding radio button of the priority level of the task. */
function checkPriority() {
	switch(taskObj.getPriority()) {
		case "low":
			document.getElementsByName('level')[0].checked = true;
			break;
		case "medium":
			document.getElementsByName('level')[1].checked = true;
			break;
		case "high":
			document.getElementsByName('level')[2].checked = true;
			break;
		default:
			alert("Invalid Priority Level");
			return;
	}
}

/* Sets the appropriate input to each of the update fields both initially and when resetting the fields. */
function setInput() {
	inputDisplay("inputTaskName", "taskName");
	inputDisplay("inputStatus", "status");
	inputDisplay("inputDescription", "description");
	
	checkPriority();
}

/*
 * Loads a task
 */
function loadTask(response, id){
	db.getTask(id, function(callback){
		var row = callback.row[0];
		var loadedTask = new task.Task(row.taskName, row.description, row.priority, row.status, row.user, row.date);
		displayUpdate(response, loadedTask);
	});
}

/*
 * Updates the task object's attributes from the input values by calling modifyTask().
 * Afterwards, the new attribute values will be saved in the database.
 * Temporary until a better way to save is found.
 */
function update() {
	var field1 = document.getElementById('inputTaskName').value;
	var field2 = document.getElementById('inputDescription').value;
	var field3;
	var field4 = document.getElementById('inputStatus').value;
	
	if (document.getElementsByName('level')[0].checked) {
		field3 = "low";
	}
	else if (document.getElementsByName('level')[1].checked) {
		field3 = "medium";
	}
	else if (document.getElementsByName('level')[2].checked){
		field3 = "high";
	}
	
	taskObj.modifyTask(field1, field2, field3, field4);
	db.updateTask(taskObj, callback);
}

/* Test coding for a task object */
function test(response) {
	var taskObj = new task.Task("taskName", "desc", "low", "status", "user", "date");
	displayUpdate(taskObj, response);
}
