var basepath = require('basepath').mainpath;
var sqlite = require(basepath + 'lib/node-sqlite/sqlite');
var slh = require("SQLiteHelper");
var fs = require('fs');
var path = require('path');
var task = require(basepath + 'static/js/task');

var dbLocation = "db/main.db"; // database location in file system


/*The dbtest object
 *	usage(assuming the user is in the CourseProject/ directory): 
 *		node tests/dbtest/dbtest.js
 *
 * output currently directed to the console.
 *
 */
dbtest = new function(){
	this.tests = [];
	this.current = 0;

	/*
	 * addTest(function)
	 *
	 * adds a test function to the array of functions
	 */
	this.addTest = function(newtest){
		this.tests[this.tests.length] = newtest; 
	}


	/*
	 * run()
	 *
	 * runs all tests, one at a time, in order
	 */
	this.run = function(){
		this.logstring = "";
		this.current = 0;
		this.callNext();
	}

	/*
	 * callNext()
	 *
	 * calls the next function in sequence
	 */
	this.callNext = function() {
		if (this.current < this.tests.length){
			this.tests[this.current]();
			this.current++;
		}

	}

	/*
	 * callLast()
	 *
	 * skips to the last "test", which should be a output function
	 */
	this.callLast = function() {
		this.tests[this.tests.length - 1]();
	}

	/*
	 * addToLog(entry)
	 *
	 * appends test data to the log
	 */
	this.addToLog = function(entry){
		this.logstring = this.logstring + entry;
	}
}


/*
 * dbExists()
 *
 * The first test, ensures the database exists, otherwise aborts testing and outputs
 *
 */
function dbExists() {
	dbtest.addToLog("checking if database exists...");
	path.exists(dbLocation, function(exists) {
		if (exists){
			dbtest.addToLog("database exists\n");
			dbtest.callNext();
		}
		else{
			dbtest.addToLog("failed: database does not exist.\n");
			dbtest.callLast();
		}
	});
}

/*
 * addUserTest()
 *
 * tests whether or not a user can be added.
 *
 */
function addUserTest(){
	dbtest.addToLog("attempting to add a user...");
	slh.addUser("test@thisdomainshouldnotexist.com", 
		"testuser", 
		"thereismorethanoneofeverything", 
		function(error){
			if (error.status == 0){
				dbtest.addToLog("user added successfully\n");
				dbtest.callNext();
			}
			else {
				dbtest.addToLog("failed to add user("
					+ error.detail.message +")\n");
				dbtest.callNext();
			}
	});
}

/*
 * userExistsTest()
 *
 * tests whether or not a users existence can be verified
 *
 */
function userExistsTest(){
	dbtest.addToLog("checking if new user exists...");
	slh.userExists("test@thisdomainshouldnotexist.com", 
		function(error){
			if (error.status == 0){
				if (error.exists){
					dbtest.addToLog("user exists\n");
					dbtest.callNext();
				}
				else{
					dbtest.addToLog("user does not exist\n");
					dbtest.callNext();
				}
			}
			else {
				dbtest.addToLog("failed to check user("
					+ error.detail.message +")\n");
				dbtest.callNext();
			}
	});
}

/*
 * addTaskTest()
 *
 * tests whether or not a task can be added.
 *
 */
function addTaskTest(){
	dbtest.addToLog("attempting to add a task...");

	var taskObj = new task.Task("noise task",
		"Find out where that noise is coming from",
		"High",
		"Work in progress",
		"test@thisdomainshouldnotexist.com",
		new Date());

	slh.addTask(taskObj,
		function(error){
			if (error.status == 0){
				dbtest.addToLog("user task added successfully\n");
				dbtest.callNext();
			}
			else {
				dbtest.addToLog("failed to add task("
					+ error.detail.message +")\n");
				dbtest.callNext();
			}
	});
}

/*
 * removeTaskTest()
 *
 * tests whether or not a task can be removed
 *
 */
function removeTaskTest(){
	dbtest.addToLog("attempting to remove task...");
	slh.removeTask("noise task", 
		function(error){
			if (error.status == 0){
				dbtest.addToLog("task removed successfully\n");
				dbtest.callNext();
			}
			else {
				dbtest.addToLog("failed to remove task("
					+ error.detail.message +")\n");
				dbtest.callNext();
			}
	});
}

/*
 * removeUserTest()
 *
 * tests whether or not a user can be removed(the same user as above)
 *
 */
function removeUserTest(){
	dbtest.addToLog("attempting to remove a user...");
	slh.removeUser("test@thisdomainshouldnotexist.com", 
		function(error){
			if (error.status == 0){
				dbtest.addToLog("user removed successfully\n");
				dbtest.callNext();
			}
			else {
				dbtest.addToLog("failed to remove user("
					+ error.detail.message +")\n");
				dbtest.callNext();
			}
	});
}

/*
 * getTableTest()
 *
 * tests whether or not a table can be retrieved.
 *
 */
function getTableTest() {
	dbtest.addToLog("attempting to retrieve user table...");
	slh.getTable("user", function(obj) {
		if(obj.status == 0) {
			dbtest.addToLog("user table retrieved successfully\n");
			dbtest.callNext();
		}
		else {
			dbtest.addToLog("failed to retrieve user table (" +
				obj.detail.message + ")\n");
			dbtest.callNext();
		}
	});
}

/*
 * getCommentsForTaskTest()
 *
 * tests whether or not comments on a task can be retrieved.
 *
 */
function getCommentsForTaskTest() {
	dbtest.addToLog("attempting to retrieve comments for task 1...");
	slh.getCommentsForTask(1, function(obj) {
		if(obj.status == 0) {
			dbtest.addToLog("comments for task 1 retrieved successfully\n");
			dbtest.callNext();
		}
		else {
			dbtest.addToLog("failed to retrieve comments for task 1 (" +
				obj.detail.message + ")\n");
			dbtest.callNext();
		}
	});
}

/*
 * printLog() 
 *
 * simplest output function, directly to console.
 *
 */
function printLog() {
	console.log(dbtest.logstring);
}

dbtest.addTest(dbExists);
dbtest.addTest(addUserTest);
dbtest.addTest(userExistsTest);
dbtest.addTest(addTaskTest);
dbtest.addTest(getTableTest);
dbtest.addTest(getCommentsForTaskTest);
dbtest.addTest(removeTaskTest);
dbtest.addTest(removeUserTest);
dbtest.addTest(printLog);
dbtest.run();
