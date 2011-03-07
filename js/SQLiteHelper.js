/**
	Before using these functions, must create the database by first
	running from command line: node createDatabase.js

	To add a task, use the function
		addTask(String taskName, String creatorEmail)
	To add a user, use the function
		addUser(String userEmail, String userNickname, String userPassword)
	To add a comment, use the function
		addComment(String commentText, int taskid, Strnig commenterEmail)

	Error codes:
		0: everythings OK
		-1: error from above (opening db, closing db, ....)
		-2: insertion or deletion object already exists or doesn't exist, etc...)
*/
var basepath = "../";
sqlite = require(basepath + 'lib/node-sqlite/sqlite');
fs = require('fs');
path = require('path');

// directories changed, assuming the node process will be
// started with CourseProject/ as the working directory
var dbLocation = "db/main.db"; // database location in file system
var dbLogLocation = "db/log.txt"; // database log
var db;

/**
	Parameter1: an error object describing an error. (error)

	This function logs this error in a txt file.
*/
function writeLog(logLine) {

	console.log(logLine);
	var logStream = fs.createWriteStream(dbLogLocation,
							{flags: 'w',
							flags: 'a',
							encoding: 'binary',
							mode: 0666}
						);
	logStream.write(new Date() + "\n\t" + logLine + "\n");

	logStream.on('drain', function() {
				logStream.end();
	});
}

/**
	Parameter1: a sql query. (String)
	Parameter2: the arguments to bind to the query. (String)
	Parameter3: a function with 2 args, error and rows, which
		performs operations on the query results. (function)

	This is only a helper function for this js file.
*/
function accessDB(sql, executionArgs, inputFunction) {

	path.exists(dbLocation, function(exists) {
		if(!exists) {
			console.log("Database doesn't exist. First run createDatabase.js");
			throw error;
		}
	});

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				writeLog(new Date() + "\n\tfunc: accessDB" + error + "\n");
				return -2; // error code for caller
			}

			if(executionArgs == null)
				db.execute(sql, inputFunction);
			else
				db.execute(sql, executionArgs, inputFunction);
	});

	db.close(function(error) {
		if(error) {
			writeLog(error);
			return -2; // error code for caller
		}
	});
}

/**
	Parameter1: an object of type Task from task.js. (Task)
	Parameter2: callback. (function)

	This function stores the task object in the database.
*/
exports.addTask = function(taskObj, callback) {

	var sql = "SELECT * FROM task";

	accessDB(sql, null, function(error, rows) {
		if(error) {
			writeLog(error);
			if (callback != null) { callback({status:-2, detail:error}); }
			return -2;
		}

		for(i = 0; i < rows.length; i++) {
			if(rows[i].taskName.toLowerCase() ==
						taskObj.getTaskName().toLowerCase()) {
				writeLog("func: addTask, task " + taskObj.getTaskName() +
						" already exists.");
				if (callback != null) { callback({status:-1, detail:{message:"task already exists."}}); }
			}
		}
		
		sql = "INSERT INTO task " +
			"(taskName, description, priority, status, user, date) " +
			"VALUES (?,?,?,?,?,?)";

		db.execute(sql, [taskObj.getTaskName(), taskObj.getDescription(),
			taskObj.getPriority(), taskObj.getStatus(), taskObj.getUser(),
			taskObj.getDate()],
			function(error, rows) {
				if(error) {
					writeLog(error);
					if (callback != null) { callback({status:-2, detail:error}); }
				}

				writeLog("task " + taskName + " by " +
					creatorEmail + " added.");
				if (callback != null) { callback({status:0, detail:error}); }
			}
		);
	});
}

/**
	Parameter1: name of task to delete. (String)
	Parameter2: callback. (function)

	removes task with given taskName if it exists.
*/
exports.removeTask = function (taskName, callback) {

	var sql = "DELETE FROM task WHERE taskname = ?";

	accessDB(sql, [taskName], function(error) {
		if(error) {
			writeLog(error);
			if (callback != null) { callback({status:-2, detail:error}); }
			return -2;
		}
		else{
			writeLog("Task: " + taskName + "successfully removed.");
			if (callback != null) { callback({status:0, detail:error}); }
		}

	});
}

/**
	Parameter1: an email. (String)
	Parameter2: a nickname. (String)
	Parameter3: a password. (String)
	Parameter4: callback (function)

	This function takes the input and stores it in the user table
	of the database.
*/
//TODO: add error checking (email invalid, nickname taken)
exports.addUser = function(userEmail, userNickname, userPassword, callback) {
	
	var sql = "SELECT * FROM user WHERE email = ? OR nickname = ?";

	accessDB(sql, [userEmail, userNickname], function(error, rows) {
			if(error) {
				writeLog(error);
				if (callback != null) { callback({status:-2, detail:error}); }
			}

			if(rows.length != 0) {
				writeLog("func: addUser, email " + userEmail + " already exists.");
				if (callback != null) { callback({status:-2, detail:{message:"user exists"}}); }
				return -1; // error code for caller
			} else {
				sql = "INSERT INTO user (email,nickname,password) " +
						"VALUES (?,?,?)";

				db.execute(sql, [userEmail, userNickname, userPassword],
						function(error, rows) {
							if(error) {
								writeLog(error);
								if (callback != null) { callback({status:-2, detail:error}); }
							}

							writeLog("user " + userEmail + ", " +
								userNickname +", with password " +
								userPassword + " added.");
								if (callback != null) { callback({status:0, detail:error}); }
						}
				);
			}
	});
}

/**
	Parameter1: email to check. (String)
	Parameter2: callback. (function)

	Checks if a user email exists in the db.
*/
exports.userExists = function (userEmail, callback) {
	var sql = "SELECT * FROM user WHERE email = ?";

	accessDB(sql, [userEmail], function(error, rows) {
			if(error) {
				writeLog(error);
				if (callback != null) { callback({status:-2, detail:error}); }
			}
			else if(rows.length != 0) {
				writeLog("user: " + userEmail + " exists.");
				if (callback != null) { callback({status:0, exists:true, detail:error}); }
			}
			else {
				writeLog("user: " + userEmail + " does not exist.");
				if (callback != null) { callback({status:0, exists:false, detail:error}); }
			}
	});
}

/**
	Parameter1: email of user to remove. (String)
	Parameter2: callback. (function)

	removes the user corresponding to the given email if it exists.
*/
exports.removeUser = function (userEmail, callback) {
	var sql = "DELETE FROM user WHERE email = ?";

	accessDB(sql, [userEmail], function(error, rows) {
			if(error) {
				writeLog(error);
				if (callback != null) { callback({status:-2, detail:error}); }
			}
			else {
				writeLog("user: " + userEmail + " removed.");
				if (callback != null) { callback({status:0, detail:error}); }
			}
	});
}

/**
	Parameter1: a comment. (String)
	Parameter2: the taskid that the comment refers to. (String)
	Parameter3: the email of the commenter. (String)

	This function adds a comment to the comment table in the database.
*/
exports.addComment = function (commentText, commentTaskid, commenterEmail) {

	var sql = "SELECT * FROM user WHERE email = ?";

	accessDB(sql, [commenterEmail], function(error, rows) {
			if(error) {
				writeLog(error);
				return -2; // error code for caller
			}

			if(rows.length != 1) {
				writeLog("func: addComment, user email " +
					commenterEmail + " not found.");
				return -1; // error code for caller
			}

			sql = "SELECT * FROM task WHERE taskid = ?";

			db.execute(sql, [commentTaskid], function(error, rows) {
				if(error) {
					writeLog(error);
					return -2; // error code for caller
				}

				if(rows.length != 1) {
					writeLog("func: addComment, taskid " +
						commentTaskid + " not found.");
					return -1; // error code for caller
				}

				sql = "INSERT INTO comment (thecomment,taskid,email) " +
						"VALUES (?,?,?)";

				db.execute(sql,
						[commentText, commentTaskid, commenterEmail],
						function(error, rows) {
							if(error) {
								writeLog(error);
								return -2; // error code for caller
							}

							writeLog("comment for taskid " + commentTaskid +
								" by " + commenterEmail + " added.");
						}
				);
			});
	});
}

/**
	Parameter1: Table name.

	Parameter2: a function that takes in 2 arguments, the first
		being an error object, the second being an array of row
		objects representing the tuples returned from the
		database.

	Usage example:
		
	getTable("user", function (error, rows) {
		if(error)
			throw error;

		for(i = 0; i < rows.length; i++) {
			console.log(rows[i].email + " " +
				rows[i].nickname + " " +
				rows[i].password);
		}
	});
*/
exports.getTable = function(tableName, callback) {
	var sql = "SELECT * FROM " + tableName;

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
		if(error)
			throw error;

		db.execute(sql, callback);
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}

/**
	Parameter1: taskid for the task whose comments the caller wants.

	Parameter2: a function that takes in 2 arguments, the first
		being an error object, the second being an array of row
		objects representing the tuples returned from the
		database.

	Usage example:
		
	
	getCommentsForTask(1, function(error, rows) {
		for(i = 0; i < rows.length; i++) {
			console.log(rows[i].thecomment);
			console.log(rows[i].taskid);
			console.log(rows[i].email);
		}
	});
*/
exports.getCommentsForTask = function(taskid, callback) {
	var sql = "SELECT * FROM comment WHERE taskid = " + taskid;

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
		if(error)
			throw error;

		db.execute(sql, callback);
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}
