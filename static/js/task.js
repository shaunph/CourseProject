/*
	Usage:
	
	To create a new Task, use:
		var myNewTask = new Task(taskName, description, priority, status, user, date);
	Note that this task is not in the database yet, call myNewTask.save() to do so.

	If you manipulate the task and wish to save it back to the database, use:
		myTask.save();
	again.
*/


/* Create a task object.
	
	taskName 	- Name of the task (String)
	description - Description of the task (String)
	priority	- Priority in relation to other tasks (["Low", "Medium", "High"])
	status		- Current completion status (["Not started", "Work in progress", "Completed"])
	user		- The creator of the task (String)
	date		- Date when task was created ( Date(year, month, day, hours, minutes, seconds) )
*/
exports.Task = function(taskName, description, priority, status, user, date) {

	this.taskName = taskName;
	this.id = undefined;
	this.description = description;
	this.priority = priority;
	this.status = status;
	this.user = user;
	this.date = date;

	this.getTaskName = function() { return this.taskName; }
	this.getId = function() { return this.id; }
	this.getDescription = function() { return this.description; }
	this.getPriority = function() { return this.priority; }
	this.getStatus = function() { return this.status; }
	this.getUser = function() { return this.user; }
	this.getDate = function() { return this.date.toLocaleDateString(); }

	this.setTaskName = setTaskName;
	this.setDescription = setDescription;
	this.setPriority = setPriority;
	this.setStatus = setStatus;

	this.modifyTask = modifyTask;
	this.save = save;
}


function setTaskName(newTaskName) {
	if( newTaskName == null || newTaskName.trim().length == 0 ) {
		throw new TypeError("No task name provided.");
	}
	this.taskName = newTaskName;
}

function setDescription(newDescription) {
	if( newDescription == null || newDescription.trim().length == 0 ) {
		throw new TypeError("No description provided.");
	}
	this.description = newDescription;
}

function setPriority(newPriority) {
	if( newPriority == null || newPriority.trim().length == 0 ) {
		throw new TypeError("No priority provided.");
	}
	this.priority = newPriority;
}

function setStatus(newStatus) {
	if( newStatus == null || newStatus.trim().length == 0 ) {
		throw new TypeError("No status provided.");
	}
	this.status = newStatus;
}

function modifyTask(taskName, description, priority, status) {
	try {
		this.setTaskName(taskName);
		this.setDescription(description);
		this.setPriority(priority);
		this.setStatus(status);
	} catch (e) {
		if (e instanceof TypeError)
			alert(e.name + ": " + e.message);
		else 
			alert(e.name + ": " + "Unknown error in modifyTask");
	}
}

// This function saves the calling Task into the DB
function save() {
	/* TODO: If the calling task is already in the database, 
			 	update this task in the database.
			 If the calling task is not in the database (ie a new task),
				store a new task into the database.
			    Then set the calling task's id with the one generated from the DB
	*/
}
