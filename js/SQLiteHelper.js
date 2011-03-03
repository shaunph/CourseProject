/**
	Before using these functions, must create the database by first
	running from command line: node createDatabase.js

	To add a task, use the function
		addTask(String taskName, String creatorEmail)
	To add a user, use the function
		addUser(String userEmail, String userNickname, String userPassword)
	To add a comment, use the function
		addComment(String commentText, int taskid, Strnig commenterEmail)
*/

//TODO: figure out why "out of memory" error occurs sometimes, but not always


sqlite = require('./../lib/node-sqlite/sqlite');
fs = require('fs');
path = require('path');

var dbLocation = "../db/main.db"; // database location in file system
var dbLogLocation = "../db/log.txt"; // database log
var db;

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

//TODO: add error checking (email invalid)
exports.addTask = function(taskName, creatorEmail) {

	var sql = "SELECT * FROM task";

	accessDB(sql, null, function(error, rows) {
		if(error) {
			writeLog(error);
			return -2;
		}

		for(i = 0; i < rows.length; i++) {
			if(rows[i].taskname.toLowerCase == taskName.toLowerCase) {
				writeLog("func: addTask, task " + taskName +
						" already exists.");
				return -1; // error code for caller
			}
		}
		
		sql = "INSERT INTO task (taskname,creator) VALUES (?,?)";

		db.execute(sql, [taskName, creatorEmail],
			function(error, rows) {
				if(error) {
					writeLog(error);
					return -2; // error code for caller
				}

				writeLog("task " + taskName + " by " +
					creatorEmail + " added.");
			}
		);
	});
}

//TODO: add error checking (email invalid, nickname taken)
exports.addUser = function(userEmail, userNickname, userPassword) {
	
	var sql = "SELECT * FROM user WHERE email = ? OR nickname = ?";

	accessDB(sql, [userEmail, userNickname], function(error, rows) {
			if(error) {
				writeLog(error);
				return -2; // error code for caller
			}

			if(rows.length != 0) {
				writeLog("func: addUser, email " + userEmail + " already exists.");
				return -1; // error code for caller
			} else {
				sql = "INSERT INTO user (email,nickname,password) " +
						"VALUES (?,?,?)";

				db.execute(sql, [userEmail, userNickname, userPassword],
						function(error, rows) {
							if(error) {
								writeLog(error);
								return -2; // error code for caller
							}

							writeLog("user " + userEmail + ", " +
								userNickname +", with password " +
								userPassword + " added.");
						}
				);
			}
	});
}

exports.addComment = function(commentText, commentTaskid, commenterEmail) {

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
exports.getTable = function(tableName, inputFunction) {
	var sql = "SELECT * FROM " + tableName;

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
		if(error)
			throw error;

		db.execute(sql, inputFunction);
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
exports.getCommentsForTask = function(taskid, inputFunction) {
	var sql = "SELECT * FROM comment WHERE taskid = " + taskid;

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
		if(error)
			throw error;

		db.execute(sql, inputFunction);
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}
