/**
    To create the database, run from command line: node createDatabase.js

    This code will create the database tables used on the website.
    Should only be run when changes are made, and after the old
    database has been deleted.

    Please update this comment when changing the database tables.

    The tables created are:
        user(email, nickname, password)
        task(taskid, taskName, description, priority, status, user, date)
        comment(thecomment, taskid, creator)
*/

var basepath = require('basepath').mainpath;

var sqlite = require(basepath + 'lib/node-sqlite/sqlite');
var fs = require('fs');
var db = sqlite.Database();
var dbLocation = basepath + "db/main.db"; // location of database

fs.mkdir(basepath + 'db', 0777);

db.open(dbLocation, function (error) {
    if(error) {
        console.log(error);
        throw error;
    }

    db.execute("CREATE TABLE user (" +
        "email TEXT PRIMARY KEY," +
        "nickname TEXT UNIQUE," +
        "password TEXT," +
        "created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        function (error) {
            if(error) {
                console.log("Error creating user table.");
                throw error;
            }

        console.log("User table created.");
    });

    db.execute("CREATE TABLE task (" +
        "taskid INTEGER PRIMARY KEY AUTOINCREMENT," +
        "taskName TEXT," +
        "description TEXT," +
        "timeSpent NUMBER," +
        "timeLeft NUMBER," +
        "priority TEXT," +
        "progress TEXT," +
        "status TEXT," +
        "user TEXT," +
        "created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        function (error) {
            if(error) {
                console.log("Error creating task table.");
                throw error;
            }

            console.log("Task table created.");
	
            db.execute("CREATE UNIQUE INDEX taskIndex" 
                +" ON task (taskName COLLATE NOCASE)",
                function(error) {
                    if(error) {
                        console.log("Error creating task table.");
                        throw error;
                    }

                    console.log("Task index created.");
                }
            );
        }
    );

    db.execute("CREATE TABLE comment (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "thecomment TEXT," + 
        "taskid NUMBER," + // FOREIGN KEY(taskid) REFERENCES task(taskid)
        "email TEXT," + // FOREIGN KEY(creator) REFERENCES user(email)
        "created TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
        function (error) {
            if(error) {
                console.log("Error creating task table.");
                throw error;
            }

        console.log("comment table created.");
    });
	
});


