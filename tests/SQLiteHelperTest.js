task = require('./../static/js/task');
SQLiteHelper = require('./../js/SQLiteHelper.js');


var task1 = new task.Task(
		"primTask",
		"do something!",
		"high",
		"in progress",
		"someone@gmail.com",
		"mar3/11");
var task2 = new task.Task(
		"secondTask",
		"do something!",
		"high",
		"in progress",
		"someone@gmail.com",
		"mar3/11");
var task3 = new task.Task(
		"task3",
		"do something!",
		"high",
		"in progress",
		"someone@gmail.com",
		"mar3/11");

SQLiteHelper.addTask(task1);
SQLiteHelper.addTask(task2);
SQLiteHelper.addTask(task3);

SQLiteHelper.getTable("task", function(error, rows) {
	for(i = 0; i < rows.length; i++)
	console.log(rows[i].taskName);
});
