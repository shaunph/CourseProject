var pagemaker = require('pagemaker'),
    url = require('url'),
    loadTask = require('loadTask').loadTask;

var displayTaskPage = function (request, response, id, taskValues) {
    response.writeHead(200, {'Content-Type': 'text/html'});

    var taskPage = new StandardPage();
    taskPage.standardMenus();

    var taskName = taskValues.getTaskName();
    var open = (taskValues.getStatus() === "Open");
    
    if (open) {
        taskName = taskName + " Details";
        //taskPage.addOnClickItem("Update Task", "/updatetask?id=" + id);
    } else {
        taskName = taskName + " Details: Closed";
    }

    taskPage.setTitle(taskName);
    taskPage.setContent("<h1>" + taskName + "</h1>");

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
    
    response.write(taskPage.toHTML());
    response.end();
};

exports.getReq = function (request, response) {
    loadTask(request, response, (url.parse(request.url, true).query).id, displayTaskPage);
};
