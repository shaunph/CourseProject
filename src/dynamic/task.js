var dbHelper = require('SQLiteHelper'),
    task = require('task'),
    pagemaker = require('pagemaker'),
    url = require('url'),
    basepath = require('basepath').mainpath,
    
    //TODO: temporary fix until we rethink error handling
    errorPage = require(basepath + '/dynamic/error_pages/errorPage');
    
    
exports.getReq = function (request,response) {
    loadTask(request, response, (url.parse(request.url, true).query)['id']);
}

function displayTaskPage(response, id, taskValues) {
    var taskPage = new StandardPage();
	var taskName = taskValues.getTaskName();
    taskPage.setTitle(taskName + " Details");
    
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
    
    // TODO : Disable this link if task status is marked as closed
    taskPage.addMenuItem("Update Task", "/updatetask.html");
    taskPage.addMenuItem("home", "/index.html");

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(taskPage.toHTML());
    response.end();
}

function loadTask(request, response, id) {

    dbHelper.getTask(id, function(callbackObj) {
            try {
                var loadRow = callbackObj.rows[0]; // Always 0 because getTask only gets 1 row, namely the row with taskid = id
            } catch(error) { // If database isn't created yet
                errorPage.getReq(request, response, 500);
            }
            
            if (loadRow == undefined) { // If task doesn't exist in db
                errorPage.getReq(request, response, 404);
            } else {
                var loadedTask = new task.task(loadRow.taskName, loadRow.description, loadRow.timeSpent,
                        loadRow.timeLeft, loadRow.priority, loadRow.progress, loadRow.status, loadRow.user);
                displayTaskPage(response, id, loadedTask);
            }
    });
}
