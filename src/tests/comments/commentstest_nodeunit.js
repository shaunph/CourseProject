var path = require('path');
var fs = require('fs');
var basepath = require('basepath').mainpath;
var sqlite = require(basepath + 'lib/node-sqlite/sqlite');
var slh = require('SQLiteHelper');
var dbLocation = (basepath + 'db/main.db');
var task = require('task');


exports.CommentsTest = {
	'Test That Comments Can Be Added': function (test) {
			test.expect(1);
        
			var succeeded = false;
        
			slh.addComment("testcomment", commentsTaskid, "test@test.com",
						function (rtv) {
							if (rtv.status == 0) {
								succeeded = true;
                        
							}
                        
							test.ok(succeeded, "Adding comments failed!");
							test.done();
						});
    },
	
    'Test That Comments Can Be Removed': function (test) {
        test.expect(1);
        
        var succeeded = false;
        slh.removeComments(commentsTaskid,
                    function (rtv) {
                        if (rtv.status == 0) {
                            succeeded = true;
                        
                        }
                        
                        test.ok(succeeded, "Removing comments failed!");
                        test.done();
                    });
    },
};