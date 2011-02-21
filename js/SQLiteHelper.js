sqlite = require('./../lib/node-sqlite/sqlite');

function addTask(taskName, creatorEmail) {

	var db = new sqlite.Database();

	db.open("../db/main.db", function(error) {
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
