/*
	== NOTE: == 
	Once "add task" and "update task" functionalities are working and in the mainline,
	I will check if this file is utilized at all. If not, I'll remove it.
	If you have any objections, please contact me.

	- Chris (nguyen__chris@hotmail.com)
	=-=-=-=-=-=

    This function inserts the specified task information into div tags.
    These div tags must have a 'name' attribute, equal to one of Task's instance variables.

    type - The name attribute of the div tag. name is the desired Task variable to display.
    (width) - An optional argument. Specifies the maximum width of the displayed text.
*/
function display(type, width) {
    var ouput, containerList;
    
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
            //alert("ERROR: Unknown Task type.");
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
    Test object to display.
*/
var taskObj = new Task("TaskNameHere", "This is a test description.", "0", "0", "Low", "progress", "Open", "user");

document.title = taskObj.getTaskName() + " Details";    // Just display the title on the html page

/*
	Test values to display.
*/
display('taskName');
display('description', '30em');
display('priority');
display('status');
display('user');
display('date');
