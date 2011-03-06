//TODO: Determine username once username system is operational
//TODO: Task name check into DB to check for like named tasks
//TODO: Use form submission to submit data to the server.

//var serv = require("CourseProject/js/dispatcher");
/* initialize sets up certain set features of the addtask page such as page 
   title and the default state of the radio button.
*/
function initialize() {
	document.title = "Add A Task";
	document.getElementById("low").checked=true;
}

/* clicked is called by addtask.html when the user attempts to submit their fields.
   It scans the required fields (all but comments) and terminates process if the fields
   are incomplete. If complete, it currently links to the main
   page and creates a task object using Chris's task.js file.
   TODO: use server and link to database 
*/
function clicked() {

	for(i = 2; i< 6; i++){
		if(document.getElementById("phrase"+i).value == ""){
			window.alert("Not all required fields are properly filled");
			return;
		}
	}

	var nom = "J Doe"; //TODO: Determine username once username system is operational
	var tnom = document.getElementById("phrase2");
	var desc = document.getElementById("phrase3");
	var ETR = document.getElementById("phrase4");
	var ETL = document.getElementById("phrase5");
	var com = document.getElementById("phrase6");
	var date = new Date();
	
	//NOTE: .checked is a boolean value that indicates if a button is checked (true = checked, false = unchecked)
	if(document.getElementById("low").checked){
		pri = document.getElementById("low").value;
	}
	else if(document.getElementById("medium").checked){
		pri = document.getElementById("medium").value;
	}
	else if(document.getElementById("high").checked){
		pri = document.getElementById("high").value;
	}
	t = new Task(tnom, desc, pri, "open", nom, date);
	//TODO: Task name check into DB to check for like named tasks
	t.save();
	//window.alert("<<success>> " + date);
	document.location="index.html";
}
