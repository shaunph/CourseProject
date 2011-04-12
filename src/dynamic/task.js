var pagemaker = require('pagemaker'),
    url = require('url'),   
    taskOps = require('taskOps');

var confirmation = function(taskName) {
    var answer = confirm("Are you sure you want to delete " + taskName + "?");
    
    if (answer) {
        // TODO: Remove the task the user is currently viewing.
        alert("Not yet implemented.\nTask should now be deleted and user should be redirected to task list.");
    }
};

var displayTaskPage = function (request, response, id, taskValues) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    var taskPage = new StandardPage();
    taskPage.standardMenus();
    
    // Format task name to display and add Update task menu item
    var taskName = taskValues.getTaskName();
    var displayName;
    var open = (taskValues.getStatus() === "Open");    
    if (open) {
        displayName = taskName + " Details";
        taskPage.addMenuItem("Update Task", "/updatetask?id=" + id);
    } else {
        displayName = taskName + " Details: Closed";
    }
    
    taskPage.setTitle(displayName);
    taskPage.setContent("<h1>" + displayName + "</h1>");

    taskPage.addContent("<h3>Description</h3>");
    taskPage.addContent(taskValues.getDescription());
    
    taskPage.addContent("<h3>Time spent so far</h3>");
    taskPage.addContent(taskValues.getTimeSpent());
    
    taskPage.addContent("<h3>Estimated time remaining</h3>");
    taskPage.addContent(taskValues.getTimeLeft());
    
    taskPage.addContent("<h3>Priority</h3>");
    taskPage.addContent(taskValues.getPriority());
    
    taskPage.addContent("<h3>Progress</h3>");
    taskPage.addContent(taskValues.getProgress());
    
    taskPage.addContent("<h3>Status</h3>");
    taskPage.addContent(taskValues.getStatus());

    taskPage.addContent("<h3>User</h3>");
    taskPage.addContent(taskValues.getUser());
    
    taskPage.addContent("<script type='text/javascript'>var confirmation = " + confirmation + "</script>");
    taskPage.addOnClickItem("Delete Task", "confirmation('" + taskName + "');");
    
    response.write(taskPage.toHTML());
    response.end();
};

exports.getReq = function (request, response) {
    taskOps.loadTask(request, response, (url.parse(request.url, true).query).id, displayTaskPage);
};
