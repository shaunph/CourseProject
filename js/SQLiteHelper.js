sqlite = require('./../lib/node-sqlite/sqlite');
fs = require('fs');

var dbLocation = "../db/main.db";
var logLocation = "../db/log.txt";
var db;

function writeLog(logLine) {

	var logStream = fs.createWriteStream(logLocation,
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

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				writeLog("error opening DB!!!");
				throw error;
			}

			if(executionArgs == null)
				db.execute(sql, inputFunction);
			else
				db.execute(sql, executionArgs, inputFunction);
	});

	db.close(function(error) {
		if(error) {
			writeLog(error);
			throw error;
		}
	});
}

//TODO: add error checking (email invalid)
function addTask(taskName, creatorEmail) {

	var sql = "SELECT * FROM task";

	accessDB(sql, null, function(error, rows) {
		if(error) {
			writeLog(error);
			throw error;
		}

		for(i = 0; i < rows.length; i++) {
			if(rows[i].taskname.toLowerCase == taskName.toLowerCase) {
				writeLog("task " + taskName + " already exists.");
				return -1; // error code for caller
			}
		}
		
		sql = "INSERT INTO task (taskid,taskname,creator) VALUES (?,?,?)";

		db.execute(sql, [rows.length, taskName, creatorEmail],
			function(error, rows) {
				if(error) {
					writeLog(error);
					throw error;
				}

				writeLog("task " + taskName + " by " +
					creatorEmail + " added.");
			}
		);
	});
}

//TODO: add error checking (email invalid, nickname taken)
function addUser(userEmail, userNickname, userPassword) {
	
	var sql = "SELECT * FROM user WHERE email = ? OR nickname = ?";

	accessDB(sql, [userEmail, userNickname], function(error, rows) {
			if(error) {
				writeLog(error);
				throw error;
			}

			if(rows.length != 0) {
				writeLog("email " + userEmail + " already exists.");
				return -1; // error code for caller
			} else {
				sql = "INSERT INTO user (email,nickname,password) " +
						"VALUES (?,?,?)";

				db.execute(sql, [userEmail, userNickname, userPassword],
						function(error, rows) {
							if(error) {
								writeLog(error);
								throw error;
							}

							writeLog("user " + userEmail + ", " +
								userNickname +", with password " +
								userPassword + " added.");
						}
				);
			}
	});
}

function addComment(commentText, commentTaskid, commenterEmail) {

	var sql = "SELECT * FROM user WHERE email = ?";

	accessDB(sql, [commenterEmail], function(error, rows) {
			if(error) {
				writeLog(error);
				throw error;
			}

			if(rows.length != 1) {
				writeLog("user email " + commenterEmail + " not found.");
				return -1; // error code for caller
			}

			sql = "SELECT * FROM task WHERE taskid = ?";

			db.execute(sql, [commentTaskid], function(error, rows) {
				if(error) {
					writeLog(error);
					throw error;
				}

				if(rows.length != 1) {
					writeLog("taskid " + commentTaskid + " not found.");
					return -1; // error code for caller
				}

				sql = "INSERT INTO comment (thecomment,taskid,email) " +
						"VALUES (?,?,?)";

				db.execute(sql,
						[commentText, commentTaskid, commenterEmail],
						function(error, rows) {
							if(error) {
								writeLog(error);
								throw error;
							}

							writeLog("comment for taskid " + commentTaskid +
								" by " + commenterEmail + " added.");
						}
				);
			});
	});
}
