sqlite = require('./../lib/node-sqlite/sqlite');

var dbLocation = "../db/main.db";
var db;

function accessDB(sql, executionArgs, inputFunction) {

	db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				console.log("error opening DB!!!");
				throw error;
			}

			if(executionArgs == null)
				db.execute(sql, inputFunction);
			else
				db.execute(sql, executionArgs, inputFunction);
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}

//TODO: add error checking (email invalid)
function addTask(taskName, creatorEmail) {

	var sql = "SELECT * FROM task";

	accessDB(sql, null, function(error, rows) {
		if(error)
			throw error;

		for(i = 0; i < rows.length; i++) {
			if(rows[i].taskname.toLowerCase == taskName.toLowerCase) {
				console.log("task already exists.");
				return;
			}
		}
		
		sql = "INSERT INTO task (taskid,taskname,creator) VALUES (?,?,?)";

		db.execute(sql, [rows.length, taskName, creatorEmail],
			function(error, rows) {
				if(error) 
					throw error;

				console.log("task added.");
			}
		);
	});
}

//TODO: add error checking (email invalid, nickname taken)
function addUser(userEmail, userNickname, userPassword) {
	
	var sql = "SELECT * FROM user WHERE email = ? OR nickname = ?";

	accessDB(sql, [userEmail, userNickname], function(error, rows) {
			if(error)
				throw error;

			if(rows.length != 0) {
				console.log("email already exists.");
				return;
			} else {
				sql = "INSERT INTO user (email,nickname,password) " +
						"VALUES (?,?,?)";

				db.execute(sql, [userEmail, userNickname, userPassword],
						function(error, rows) {
							if(error)
								throw error;

							console.log("user added");
						}
				);
			}
	});
}

function addComment(commentText, commentTaskid, commenterEmail) {

	var sql = "SELECT * FROM user WHERE email = ?";

	accessDB(sql, [commenterEmail], function(error, rows) {
			if(error)
				throw error;

			if(rows.length != 1) {
				console.log("user email not found.");
				return;
			}

			sql = "SELECT * FROM task WHERE taskid = ?";

			db.execute(sql, [commentTaskid], function(error, rows) {
				if(error)
					throw error;

				if(rows.length != 1) {
					console.log("taskid not found.");
					return;
				}

				sql = "INSERT INTO comment (thecomment,taskid,email) " +
						"VALUES (?,?,?)";

				db.execute(sql,
						[commentText, commentTaskid, commenterEmail],
						function(error, rows) {
							if(error)
								throw error;

							console.log("comment added");
						}
				);
			});
	});
}
/*
addTask("tasknammy", "masud@gmail.ca");
addUser("masud@hotmail.com", "masudio", "coyote");
addComment("hi im a comment", 0, "masud@hotmail.com");*/
