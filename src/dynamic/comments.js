var pagemaker = require('pagemaker');
var slh = require('SQLiteHelper');
var url = require('url');
var upops = require('uploadOps');

exports.getReq = function (request,response) {
    send(response,request,url.parse(request.url,true).query["taskid"]);
}

exports.postReq = function (request,response, dataBuffer) {
    var parsed = upops.parseMultipartFormdata(dataBuffer);
    
    //Add comment to the database (truncated to 500 characters)
    slh.addComment(parsed["thecomment"].toString().substring(0,1024), parsed["taskid"].toString(),
    parsed["email"].toString(), function(obj) {
        if(obj.status != 0) {
            //TODO: Send a 500 error page
            console.log("Error saving comment: " + obj.detail);
            return;
        }
        else {
            // Once comment has been added, display the comments for the task
            send(response, request, url.parse(request.url,true).query["taskid"]);
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

            var cookies = upops.parseCookies(request.headers);
           
            // Show add comement box if user is logged in 
            if(cookies.Email) {
                // Add comment form
                page.addContent("<div><span>Enter a comment:</span></div>" +
                        "<br />");
                        
                page.addContent("<script type='text/javascript'>" +
                    "function validate(form) {" +
                        "var c = document.getElementById('thecomment');" +
                        "if(!/\\S/.test(c.value)){" +
                            "window.alert('Please enter a comment');" +
                            "return;" +
                        "}" +
                        "else if(c.value.length > '1024'){" +
                            "window.alert('This comment exceeds the maximum length of 500 characters.');" +
                            "return;" +
                        "}" +
                        "form.form.submit();" +
                    "}" +
                    "</script>");

                page.addContent("<form action='comments?taskid=" + taskId + "' method='post' enctype='multipart/form-data'>" + 
                        "<textarea name='thecomment' id='thecomment' rows='4' cols='50'></textarea><br />" +
                        "<input type='hidden' name='taskid' value='" + taskId + "'>" + 
                        "<input type='hidden' name='email' value='"+cookies.Email+"'>" + 
                        "<button type='button' class='rounded' id='enter' onclick='validate(this)'>" +
                        "<span>Save</span>" +
                        "</button>" +
                        "</form>");
            }
            else {
                page.addContent("<div><span style='font-weight:bold'>Login to add a comment.</span></div>" + 
                    "<br />");
            }

            var numComments = obj.rows.length;
            
            // If there are no comments for the task, say so
            if (numComments == 0) {
                page.addContent("<div><span>There are currently no comments for this task.</span></div>" +
                            "<br />");
            }
            // Otherwise, display all comments (newest on top)
            else {
                for (i = numComments-1; i >= 0; i--) {
                    page.addContent("<div class='commentBox'>" +
                            "<span>" + obj.rows[i].email + " says: </span>" +
                            "<br />" +
                            "<span class='timeStamp'>" + obj.rows[i].created + "</span>" +
                            "<br /><br />" +
                            "<span>" + obj.rows[i].thecomment + "</span>" +
                            "</div>" +
                            "<br /><br />");
                }
            }
            
            page.standardMenus();
            response.write(page.toHTML());
            response.end();
        });
    }
}
