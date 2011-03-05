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
		/*Remove // on alert() after test object is not relied upon*/
		default:
			//alert("Invalid Priority Level");
			return;
	}
}

/* Sets the appropriate input to each of the update fields */
function setInput() {
	inputDisplay("inputTaskName", "taskName");
	inputDisplay("inputStatus", "status");
	inputDisplay("inputDescription", "description");
	
	checkPriority();
}

/*
 * Since page needs to be re-loaded to check for new values, taskObj in the function below is always "re-set".
 * To be modified in the future with save()
 */
function update() {
	var priorityLevel;
	if (document.getElementsByName('level')[0].checked == true) {
		priorityLevel = "low";
	}
	else if (document.getElementsByName('level')[1].checked == true) {
		priorityLevel = "medium";
	}
	else {
		priorityLevel = "high";
	}
	modifyTask(document.getElementById('inputTaskName').value, document.getElementById('inputDescription').value, priorityLevel, document.getElementById('inputStatus').value);
}