
url = require('url');
slh = require('SQLiteHelper');
pagemaker = require('pagemaker');


exports.getReq = function(request, response) {

    var parameters = url.parse(request.url,true).query;
    loadTaskList(parameters, response);
}

function loadTaskList(parameters, response) {

    response.writeHead(200, {'Content-Type' : 'text/html'});

    slh.getTable("task", function(obj) {
        if(obj.status != 0) {
            console.log("error getting tasks table: " + obj.detail);
            return;
        }

        var taskListPage = "";
        taskListPage = taskListPage.concat("<h4>" +
                "<div class='row'>" +
                "<div class='taskListHeading'>Name</div>" +
                "<div class='taskListHeading'>Priority</div>" +
                "<div class='taskListHeading'>Progress</div>" +
                "<div class='taskListHeading'>Status</div>" +
                "<div class='taskListHeading'>Creator</div>" +
                "</h4></div>");


        taskListPage = taskListPage.concat(prioritizer("High", obj));
        taskListPage = taskListPage.concat(prioritizer("Medium", obj));
        taskListPage = taskListPage.concat(prioritizer("Low", obj));

        response.write(taskListPage);
        response.end();

});


}

function prioritizer(currentPriority, obj)
{
      var pageSection = "";
      for(i = 0; i < obj.rows.length; i++) 
      {
            rowID = obj.rows[i].taskid;
            rowName = obj.rows[i].taskName;
            rowPriority = obj.rows[i].priority;
            rowProgress = obj.rows[i].progress;
            rowStatus = obj.rows[i].status;
            rowUser = obj.rows[i].user;
            //rowDesc = obj.rows[i].description;
            if(rowPriority == currentPriority) 
            {
               pageSection = pageSection.concat("<div class='row'>" +
                 "<div class='taskOutput'><a href=\"task?id=" + rowID + "\">"+ rowName + "</a></div>" +
                 "<div class='taskOutput'>" + rowPriority + "</div>" +
                 "<div class='taskOutput'>" + rowProgress + "</div>" +
                 "<div class='taskOutput'>" + rowStatus + "</div>" +
                 "<div class='taskOutput'>" + rowUser + "</div>" +
                  "</div>");
            }

      }
      return pageSection;
}
