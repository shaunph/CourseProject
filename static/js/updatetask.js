/* 
 * Similar to display() in taskpage.js, but doesn't utilize innerHTML.
 * Displays specified values within an input area.
 * id - specified id of the form element
 * info - the data that is to be displayed within that element
 */
function inputDisplay(id, info) {
	var displayValue;
	switch(info) {
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
			alert("Invalid Info");
			return;
	}
	document.getElementById(id).value = displayValue;
}

/* Checks the corresponding radio button of the priority level of the task */
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

/* Sets the appropriate input to each of the update fields both initially and when resetting the fields.
 */
function setInput() {
	inputDisplay("inputTaskName", "taskName");
	inputDisplay("inputStatus", "status");
	inputDisplay("inputDescription", "description");
	
	checkPriority();
}

/*
 * Takes the new values inputted into the fields
 * Calls modifyTask() and save() to store modified values in the DB
 * modifyTask() and save() are both from task.js
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
	taskObj.save();
}

/* TODO: Take in an id from the task list page and call loadTask() from task.js */
//var taskObj = loadTask(id);

var taskObj = new Task("TaskName", "desc", "low", "status", "user", "date");
document.title = "Update " + taskObj.getTaskName();