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
	description - Description of the task. Pass in an empty string for a Task without a description. (String)
	priority	- Priority in relation to other tasks (["Low", "Medium", "High"])
	progress	- User defined message of the current progress (String)
	status		- Availability of task (["Open", "Closed"])
	user		- The email of the task creator (String)
*/
exports.Task = function(taskName, description, priority, progress, status, user) {

	this.taskName;
	this.id = undefined;
	this.description;
	this.priority;
	this.progress;
	this.status;
	this.user;
	this.date = new Date();	// Date of when the task was created
	
	this.getTaskName = function() { return this.taskName; }
	this.getId = function() { return this.id; }
	this.getDescription = function() { return this.description; }
	this.getPriority = function() { return this.priority; }
	this.getProgress = function() { return this.progress; }
	this.getStatus = function() { return this.status; }
	this.getUser = function() { return this.user; }
	this.getDate = function() { return this.date.toLocaleDateString(); }

	this.setTaskName = setTaskName;
	this.setDescription = setDescription;
	this.setPriority = setPriority;
	this.setProgress = setProgress;
	this.setStatus = setStatus;
	this.setUser = setUser;

	// Set properties using set methods to ensure valid parameters.
	this.setTaskName(taskName);
	this.setDescription(description);
	this.setPriority(priority);
	this.setProgress(progress);
	this.setStatus(status);
	this.setUser(user);
	
	this.modifyTask = modifyTask;
	this.save = save;
}

function setTaskName(newTaskName) {
	if( typeof(newTaskName) != "string" && typeof(newTaskName) != "number" ) {
		throw new TypeError("Task name not provided, or invalid Task name type.");
	}
	else if ((""+newTaskName).trim().length == 0) {
		throw new TypeError("Task names must be at least 1 character long.");
	}
	this.taskName = newTaskName;
}

function setDescription(newDescription) {
	if ( typeof(newDescription) != "string" && typeof(newDescription) != "number" ) {
		throw new TypeError("Invalid task description type.");
	}
	this.description = newDescription;
}

function setPriority(newPriority) {
	if( newPriority != "Low" && newPriority != "Medium" && newPriority != "High" ) {
		throw new TypeError("Invalid Priority.");
	}
	this.priority = newPriority;
}

function setProgress(newProgress) {
	if ( typeof(newProgress) != "string" && typeof(newProgress) != "number" ) {
		throw new TypeError("Invalid task progress type.");
	}
	this.progress = newProgress;
}

function setStatus(newStatus) {
	if( newStatus != "Open" && newStatus != "Closed" ) {
		throw new TypeError("Invalid Status.");
	}
	this.status = newStatus;
}

function setUser(newUser) {
	//TODO: Check if user is a valid email address (of type String)
	if (typeof(newUser) != "string") {
		throw new TypeError("Invalid User type.");
	}
	else if (newUser.trim().length == 0) {
		throw new TypeError("User names must be at least 1 character long.");
	}
	this.user = newUser;
}

function modifyTask(taskName, description, priority, progress, status, user) {
	try {
		this.setTaskName(taskName);
		this.setDescription(description);
		this.setPriority(priority);
		this.setProgress(progress);
		this.setStatus(status);
		this.setUser(user);
	} catch (e) {
		if (e instanceof TypeError)
			throw e;
		else 
			throw new Error(e.name + ": " + "Unknown error in modifyTask");
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
