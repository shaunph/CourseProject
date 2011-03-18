var path = require('path');
var fs = require('fs');
var basepath = require('../basepath').mainpath;
var sqlite = require(basepath + '/lib/node-sqlite/sqlite');
var slh = require(basepath + '/js/SQLiteHelper');
var dbLocation = (basepath + '/tests/db/main.db');
var task = require(basepath + '/static/js/task');


/**
 * Test file for testing using nodeunit.
 * Based off the original dbtest.js file.
 **/


exports.DataBaseTests = {
    // This set-up function doesn't work yet. createDatabase should have
    // a callback so that it's clear when it's finished executing. Until then,
    // the script that runs this test is creating the database, so the tests aren't run
    // until it's done. Then a tear-down can be written that will remove the test database.
    
    /*'Set-up': function (test) {
        var create = require('../../js/createDatabase.js').dbLocation=dbLocation;
        
        test.done();
    },*/
    
    'Test That Database Exists': function (test) {
        test.expect(1);
        dbExists = path.existsSync(dbLocation);
        test.ok(dbExists, "Database does not exist at " + dbLocation + "!");
        test.done();
    },
    
    'Test That Users Can Be Added': function (test) {
        test.expect(1);
        
        var succeeded = false;
        while (!path.existsSync(dbLocation)) {}
        slh.addUser("test@testsitedoesntexist.com",
                    "testnick",
                    "testpass",
                    function (retV) {
                        if (retV.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        // The next bit is KEY for asynchronous testing! Notice how the assertion and
                        // test.done() are in the CALLBACK function?? The test won't "finish" until the asynchronous
                        // call is done!
                        test.ok(succeeded, "Failed to add user!");
                        test.done();
                    });
    },
    
    'Test That User Exists': function (test) {
        test.expect(1);
        
        var succeeded = false;
        try{
        slh.userExists("test@testsitedoesntexist.com",
                        function (retV) {
                            succeeded = retV.exists;
                            test.ok(succeeded, "User does not exist!");
                            test.done();
                        });
        }catch(e){console.log(e);}
    },
    
    'Test That Nickname Exists': function (test) {
        test.expect(1);
        
        var succeeded = false;
        slh.nickExists("testnick",
                        function (retV) {
                            succeeded = retV.exists;
                            test.ok(succeeded, "Nickname does not exist!");
                            test.done();
                        });
    },
    
    'Test That Tasks Can Be Added': function (test) {
        test.expect(1);
        
        var someTask = new task.Task("taskname","descr","Low","Not Started","test@testsitedoesntexist.com",Date());
        var succeeded = false;
        slh.addTask(someTask,
                    function (retV) {
                        if (retV.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        test.ok(succeeded, "Failed to add task!");
                        test.done();
                    });
    },
    /* ------ this needs to be uncommented once taskids are implemented ---------
    'Test That Comments Can Be Added': function (test) {
        test.expect(1);
        
        var succeeded = false;
        
        // Change "taskname" to the taskid once taskids are implemented
        slh.addComment("testcomment", "taskname", "test@testsitedoesntexist.com",
                    function (retV) {
                        if (retV.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        test.ok(succeeded, "Failed to add comment!");
                        test.done();
                    });
    },*/
    
    // Insert a test here for getting task comments once taskids are implemented
    
    'Test That Tasks Can Be Removed': function (test) {
        test.expect(1);
        
        var succeeded = false;
        slh.removeTask("taskname",
                    function (retV) {
                        if (retV.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        test.ok(succeeded, "Failed to remove task!");
                        test.done();
                    });
    },
    
    'Test That Users Can Be Removed': function (test) {
        test.expect(1);
        
        var succeeded = false;
        slh.removeUser("test@testsitedoesntexist.com",
                    function (retV) {
                        if (retV.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        test.ok(succeeded, "Failed to remove user!");
                        test.done();
                    });  
    }
    
    // Insert a database tear-down once the callback in createDatabase is implemented
};
