var path = require('path');
var fs = require('fs');
var basepath = require('basepath').mainpath;
var sqlite = require(basepath + '/lib/node-sqlite/sqlite');
var dbLocation = (basepath + '/tests/db/main.db');
var http = require('http');
var server;


/**
 * Test file for testing using nodeunit.
 **/


exports.SignupTests = {
    'Set-up': function (test) {
        // A bit of a hack. Setting argv to have a port number, then running dispatcher.
        process.argv[2] = 5555;
        
        // Need to change the directory so that the dispatcher can find the files to send back
        try {
            process.chdir(basepath);
        } catch (e) { console.log(e); }
        
        var tester = require(basepath + '/js/dispatcher.js');
        server = http.createClient(5555, host='csc');
        test.done();
    },
    
    'Test Sign-Up (add user) Function': function (test) {
       // test.expect(1);
        
        var Email = "test@testsitedoesntexist.com";
        var Username = "testnick";
        var Password = "testpass";
        
        var rawData = "Email=" + Email + "&Username=" + Username + "&Password=" + Password;
        var encoding = 'utf8';
        
        // Send request, trying to add user
        getReq = server.request(method='POST', '/signupRequest', {'Content-Length': rawData.length, 'Content-Type': 'application/x-www-form-urlencoded'});
        getReq.end(rawData, encoding);
        getReq.on('response', function (response) {
                test.ok(response.statusCode == 200, "Server responded with error code " + response.statusCode + " to request for /signupRequest");
                test.done();
        });
    },
    
    
    // After the above test is working (after sign-up is actually implemented),
    // take a look at dbtest_nodeunit.js, and grab the userExists() and
    // removeUser() tests to make sure the user has actually been added!
    
    'Tear-down': function (test) {
        // Put any future tear-down op's in here
        test.done();
    }
};
