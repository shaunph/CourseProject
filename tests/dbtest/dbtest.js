var basepath = "../../";
var sqlite = require(basepath + 'lib/node-sqlite/sqlite');
var slh = require(basepath + "js/SQLiteHelper");
var fs = require('fs');
var path = require('path');

var dbLocation = "db/main.db"; // database location in file system


/*The dbtest object
 *	usage: dbtest.run()
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
dbtest.addTest(removeUserTest);
dbtest.addTest(printLog);
dbtest.run();
