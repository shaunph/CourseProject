var path = require('path');
var fs = require('fs');
var basepath = require('../basepath').mainpath;
var http = require('http');
var server;


/**
 * Test file for testing using nodeunit.
 **/


exports.DispatcherTests = {
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
    
    'Test resolveGet Function': function (test) {
        test.expect(2);
        // Send request, testing for a 404 Not Found
        var getReq = server.request(method='GET', '/NOTAFILE.html');
        getReq.end();
        getReq.on('response', function (response) {
            test.ok(response.statusCode == 404, "Server responded with error code " + response.statusCode + " to request for /NOTAFILE.html");
        });
        
        // Send request, testing for a 200 OK
        getReq = server.request(method='GET', '/index.html');
        getReq.end()
        getReq.on('response', function (response) {
            response.on('data', function(){
                test.ok(response.statusCode == 200, "Server responded with error code " + response.statusCode + " to request for /index.html");
                test.done();
            });
        });
    },
    
    
    'Test resolvePost Function': function (test) {
        test.expect(1);
        // Send request, testing for a 404 Not Found
        var getReq = server.request(method='POST', '/NOTAFILE?.html');
        getReq.end();
        getReq.on('response', function (response) {
            test.ok(response.statusCode == 404, "Server responded with error code " + response.statusCode + " to request for /NOTAFILE?.html");
            test.done()
        });
        
        // Remove test.done() from above and fill in the request with a dynamic file with a ? in the name, as
        // that's the method that the dispatcher is currently using to get a dynamic page
        // Remember to change test.expext(1) to expect 2 assertions!
        
        /*// Send request, testing for a 200 OK
        getReq = server.request(method='POST', '/');
        getReq.end()
        getReq.on('response', function (response) {
            test.ok(response.statusCode == 200, "Server responded with error code " + response.statusCode + " to request for /index.html");
            test.done();
        });*/
    },
    
    'Test sendStaticObj Function': function (test) {
        test.expect(1);
        // Send request
        getReq = server.request(method='GET', '/signup.html');
        getReq.end()
        getReq.on('response', function (response) {
            response.on('data', function() {
                test.ok(response.statusCode == 200, "Server responded with error code " + response.statusCode + " to request for /signup.html");
                test.done();
            });
        });
    },
    
    'Test sendDynamicObj Function': function (test) {
       // Can't really test this yet
       test.done();
    },
    
    'Tear-down': function (test) {
        // Put any future tear-down op's in here
        test.done();
    }
};
