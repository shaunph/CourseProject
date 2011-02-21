sqlite = require('./../lib/node-sqlite/sqlite');

var dbLocation = "../db/main.db";

//TODO: add error checking (email invalid)
function addTask(taskName, creatorEmail) {

	var db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				console.log("error opening DB!!!");
				throw error;
			}

			var sql = "SELECT * FROM task";
			db.execute(sql, function(error, rows) {
				if(error)
					throw error;

				for(i = 0; i < rows.length; i++) {
					if(rows[i].taskname == taskName) {
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
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}

//TODO: add error checking (email invalid, nickname taken)
function addUser(userEmail, userNickname, userPassword) {
	
	var db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				console.log("error opening DB!!!");
				throw error;
			}

			var sql = "SELECT * FROM user WHERE email = ? OR nickname = ?";

			db.execute(sql, [userEmail, userNickname], function(error, rows) {
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
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}

function addComment(commentText, commentTaskid, commenterEmail) {

	var db = new sqlite.Database();

	db.open(dbLocation, function(error) {
			if(error) {
				console.log("error opening DB!!!");
				throw error;
			}

			var sql = "SELECT * FROM user WHERE email = ?";

			db.execute(sql, [commenterEmail], function(error, rows) {
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

						sql = "INSERT INTO comment (thecomment,taskid,email) "+
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
	});

	db.close(function(error) {
		if(error)
			throw error;
	});
}
