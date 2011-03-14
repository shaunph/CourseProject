/**
	To create the database, run from command line: node createDatabase.js

	This code will create the database tables used on the website.
	Should only be run when changes are made, and after the old
	database has been deleted.

	Please update this comment when changing the database tables.

	The tables created are:
		user(email, nickname, password)
		task(taskid, taskname, description, priority, status, user, date)
		comment(thecomment, taskid, creator)
*/

sqlite = require('./../lib/node-sqlite/sqlite');
fs = require('fs');

var db = sqlite.Database();
var dbLocation = "./db/main.db"; // location of database

fs.mkdir('./db', 0777);

db.open(dbLocation, function (error) {
	if(error) {
		console.log(error);
		throw error;
	}

	db.execute("CREATE TABLE user (" +
		"email TEXT PRIMARY KEY," +
		"nickname TEXT," +
		"password TEXT)",
		function (error) {
			if(error) {
				console.log("Error creating user table.");
				throw error;
			}

		console.log("User table created.");
	});

	db.execute("CREATE TABLE task (" +
		"taskid INTEGER PRIMARY KEY AUTOINCREMENT," +
		"taskname TEXT," +
		"description TEXT," +
		"priority TEXT," +
		"status TEXT," +
		"user TEXT," +
		"date NUMBER)",
		function (error) {
			if(error) {
				console.log("Error creating task table.");
				throw error;
			}

			console.log("Task table created.");
		}
	);

	db.execute("CREATE TABLE comment (" +
		"thecomment TEXT," + // do i need a primary key?
		"taskid NUMBER," + // FOREIGN KEY(taskid) REFERENCES task(taskid)
		"email TEXT)", // FOREIGN KEY(creator) REFERENCES user(email)
		function (error) {
			if(error) {
				console.log("Error creating task table.");
				throw error;
			}

		console.log("comment table created.");
	});

});

db.close(function(error) {
	if(error)
		throw error;
});

