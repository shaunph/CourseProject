sqlite = require('./../lib/node-sqlite/sqlite');
fs = require('fs');
path = require('path');

// directories changed, assuming the node process will be
// started with CourseProject/ as the working directory
var dbLocation = "db/main.db"; // database location in file system
var dbLogLocation = "db/log.txt"; // database log
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
			throw new Error('');
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
exports.addTask = function (taskName, creatorEmail,callback) {

	var sql = "SELECT * FROM task";

	accessDB(sql, null, function(error, rows) {
		if(error) {
			writeLog(error);
			if (callback != null) { callback({status:-2, detail:error}); }
			return -2;
		}

		for(i = 0; i < rows.length; i++) {
			if(rows[i].taskname.toLowerCase == taskName.toLowerCase) {
				writeLog("func: addTask, task " + taskName +
						" already exists.");
				if (callback != null) { callback({status:-1, detail:{message:"task already exists."}}); }
			}
		}
		
		sql = "INSERT INTO task (taskid,taskname,creator) VALUES (?,?,?)";

		db.execute(sql, [rows.length, taskName, creatorEmail],
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

//TODO: add error checking (email invalid)
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

