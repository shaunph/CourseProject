var pagemaker = require('pagemaker');
var slh = require('SQLiteHelper');
var url = require('url');
var upops = require('uploadOps');

exports.getReq = function (request,response) {
    send(response,request,url.parse(request.url,true).query["taskid"]);
}

exports.postReq = function (request,response, dataBuffer) {
    var parsed = upops.parseMultipartFormdata(dataBuffer);
    
    slh.addComment(parsed["thecomment"].toString(), parsed["taskid"].toString(), "user@email.com", function(obj) {
        if(obj.status != 0) {
            //TODO: Send a 500 error page
            console.log("Error saving comment: " + obj.detail);
            return;
        }
        else {
            send(response, parsed["taskid"]);
        }
    });
}

send = function (response,request, taskId) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    // If taskid isn't set, return an error
    if (taskId == undefined) {
        var page = new StandardPage(request);
            
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

            var page = new StandardPage(request);
            page.setTitle("Comments for task " + taskId);
            
            // Add comment form
            page.addContent("<div><span>Enter a comment:</span></div>" +
                            "<br />");
            
            page.addContent("<form action='comments.js' method='post' enctype='multipart/form-data'>" + 
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
