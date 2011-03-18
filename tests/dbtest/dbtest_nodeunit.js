var path = require('path');
var fs = require('fs');
var basepath = fs.realpathSync("../");
var sqlite = require(basepath + '/lib/node-sqlite/sqlite');
var slh = require("SQLiteHelper");
var dbLocation = (basepath + "/db/main.db"); // database location in file system


/**
 * Test file for testing using nodeunit.
 * Based off the original dbtest.js file.
 **/


exports.DataBaseTests = {
    'Test That Database Exists': function (test) {
        test.expect(1)
        dbExists = path.existsSync(dbLocation);
        test.ok(dbExists, "Database does not exist!");
        test.done();
    },
    
    'Test That Users Can Be Added': function (test) {
        //test.expect(1)        // Uncomment this line when SQLiteHelper.js doesn't segfault
                                // so we don't get ReferenceErrors on callback being undefined
        var succeeded = false;
        slh.addUser("test@testsitedoesntexist.com",
                    "testnick",
                    "testpass",
                    callback);
                    
                    /**
                     * SQLiteHelper.js needs to be developed some more.
                     * Attempting to add a user results in a segfault,
                     * but passing "callback" at least allows the test
                     * to fail. Once this is sorted out, 'callback'
                     * should be replaced by the following:
                     *
                     * function (status, error) {
                     *     if (status == 0) {
                     *         succeeded = true;
                     *     }
                     * }
                     **/
                     
        test.ok(succeeded, "Failed to add user!");
        test.done();
    },
    
    'Test That User Exists': function (test) {
        //test.expect(1)        // Uncomment this line when SQLiteHelper.js doesn't segfault
                                // so we don't get ReferenceErrors on callback being undefined
        var succeeded = false;
        slh.userExists("test@testsitedoesntexist.com",
                        callback);
    	
                    /**
                     * SQLiteHelper.js needs to be developed some more.
                     * Attempting to add a user results in a segfault,
                     * but passing "callback" at least allows the test
                     * to fail. Once this is sorted out, 'callback'
                     * should be replaced by the following:
                     *
                     * function (status, exists) {
                     *     if (exists == true) {
                     *         succeeded = true;
                     *     }
                     * }
                     **/
                     
        test.ok(succeeded, "User does not exist!");
        test.done();
    },
    
    'Test That Tasks Can Be Added': function (test) {
        //test.expect(1)        // Uncomment this line when SQLiteHelper.js doesn't segfault
                                // so we don't get ReferenceErrors on callback being undefined
        var succeeded = false;
        slh.addTask("taskname",
                    "test@testsitedoesntexist.com",
                    callback);
                    
                    /**
                     * SQLiteHelper.js needs to be developed some more.
                     * Attempting to add a user results in a segfault,
                     * but passing "callback" at least allows the test
                     * to fail. Once this is sorted out, 'callback'
                     * should be replaced by the following:
                     *
                     * function (status, error) {
                     *     if (status == 0) {
                     *         succeeded = true;
                     *     }
                     * }
                     **/
                     
        test.ok(succeeded, "Failed to add task!");
        test.done();
    },
    
    'Test That Tasks Can Be Removed': function (test) {
        //test.expect(1)        // Uncomment this line when SQLiteHelper.js doesn't segfault
                                // so we don't get ReferenceErrors on callback being undefined
        var succeeded = false;
        slh.removeTask("taskname",
                    callback);
                    
                    /**
                     * SQLiteHelper.js needs to be developed some more.
                     * Attempting to add a user results in a segfault,
                     * but passing "callback" at least allows the test
                     * to fail. Once this is sorted out, 'callback'
                     * should be replaced by the following:
                     *
                     * function (status, error) {
                     *     if (status == 0) {
                     *         succeeded = true;
                     *     }
                     * }
                     **/
                     
        test.ok(succeeded, "Failed to remove task!");
        test.done();
    },
    
    'Test That Users Can Be Removed': function (test) {
        //test.expect(1)        // Uncomment this line when SQLiteHelper.js doesn't segfault
                                // so we don't get ReferenceErrors on callback being undefined
        var succeeded = false;
        slh.removeUser("test@testsitedoesntexist.com",
                    callback);
                    
                    /**
                     * SQLiteHelper.js needs to be developed some more.
                     * Attempting to add a user results in a segfault,
                     * but passing "callback" at least allows the test
                     * to fail. Once this is sorted out, 'callback'
                     * should be replaced by the following:
                     *
                     * function (status, error) {
                     *     if (status == 0) {
                     *         succeeded = true;
                     *     }
                     * }
                     **/
                     
        test.ok(succeeded, "Failed to remove user!");
        test.done();
    }
};

