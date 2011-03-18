/*
    This function inserts the specified task information into div tags.
    These div tags must have a 'name' attribute, equal to one of Task's instance variables.

    type - The name attribute of the div tag. name is the desired Task variable to display.
    (width) - An optional argument. Specifies the maximum width of the displayed text.
*/
function display(type, width) {
	var output, containerList;
	
	// If optional argument 'width' is not provided, use a default width of 30em.
	if (width === undefined)
		width = "30em";
	
	switch(type) {
		case "taskName":
			output = taskObj.getTaskName();
			break;
		case "id":
			output = taskObj.getId();
			break;
		case "description":
			output = taskObj.getDescription();
			break;
		case "priority":
			output = taskObj.getPriority();
			break;
		case "status":
			output = taskObj.getStatus();
			break;
		case "user":
			output = taskObj.getUser();
			break;
		case "date":
			output = taskObj.getDate();
			break;
		default:
			alert("ERROR: Unknown Task type.");
			return;
	}

	// containerList will be a NodeList containing every tag with name=type
	containerList = document.getElementsByName(type);
	
	// For each tag with name=type, insert the 'type' information
	// as well as set the width to display this information at.
	for (var i = 0 ; i < containerList.length ; i++) {
		containerList[i].style.width = width;
		containerList[i].innerHTML = output;
	}
}



/*
    Any page that links to the task page will send a task ID, which will be used here to reference the
	database for the task data. This data will be used as arguments to the Task constructor to create the 
    below object.

    For now, these are test parameters. 
*/
var taskObj = new Task("TaskNameHere", "This is a test description. ", "priority", "status", "user", "date");

document.title = taskObj.getTaskName() + " Details";	// Just display the title on the html page

display('taskName');display('description', '30em');display('priority');display('status');display('user');display('date');
