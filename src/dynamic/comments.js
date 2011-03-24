var pagemaker = require('./../js/pagemaker');
var slh = require("./../js/SQLiteHelper.js");
var url = require('url');

exports.getReq = function (request,response) {
    send(response,url.parse(request.url,true).query["taskid"]);
}

exports.postReq = function (request,response) {
    //TODO: Read incoming post data and store in in the database
    send(response,url.parse(request.url,true).query["taskid"]);
}

send = function (response, taskId) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    // If taskid isn't set, return an error
    if (taskId == undefined) {
        var page = new StandardPage();
            
        page.addContent("<div><span>Error: No Task ID defined.</span></div>" +
                            "<br />");
        page.standardMenus();
        response.write(page.toHTML());
        response.end();
    }
    else {
        // Load the comments from the database
        slh.getCommentsForTask(taskId, function(obj) {

            // If there was an error, return
            if(obj.status != 0) {
                console.log("Error getting comment table: " + obj.detail);
                return;
            }

            var page = new StandardPage();
            page.setTitle("Comments for task " + taskId);
            
            // Add comment form
            page.addContent("<div><span>Enter a comment:</span></div>" +
                            "<br />");
            
            page.addContent("<form action='comments.js' method='post'>" + 
                "<textarea name='thecomment' rows='4' cols='50'></textarea><br />" +
                "<input type='hidden' name='taskid' value=" + taskId + ">" + 
                "<input type='submit' value='Save'>" +
                "</form>");
            
            var numComments = obj.rows.length;
            
            // If there are no comments for the task, say so
            if (numComments == 0) {
                page.addContent("<div><span>There are currently no comments for this task.</span></div>" +
                            "<br />");
            }
            // Otherwise, display all comments
            else {
                for (i = 0; i < numComments; i++) {
                    page.addContent("<div>" +
                            "<span>" + obj.rows[i].email + " says: </span>" +
                            "<br />" +
                            "<span>" + obj.rows[i].thecomment + "</span>" +
                            "</div>" +
                            "<br />");
                }
            }
            
            page.standardMenus();

            response.write(page.toHTML());
            
            response.end();
            
        });
    
    }
    
}