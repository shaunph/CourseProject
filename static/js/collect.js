var task = require('task.js');
/* initialize sets up certain set features of the addtask page such as page 
   title and the default state of the radio button.
*/
function initialize() {
	document.title = "Add A Task";
	document.getElementById("low").checked=true;
    document.getElementById("NS").checked=true;
}

/* clicked is called by addtask.html when the user attempts to submit their fields.
   It scans the required fields (all but comments) and terminates process if the fields
   are incomplete. If complete, it currently displays a success box and links to the main
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

    var ETR = document.getElementById("phrase4").value;
	var ETL = document.getElementById("phrase5").value;

    if(isNaN(parseFloat(ETR)) || isNaN(parseFloat(ETL))){
        window.alert("Time field entries must be a number");
		return;
    }
	var nom = "J Doe"; //temporary filler until user system is up
	var tnom = document.getElementById("phrase2").value;
	var desc = document.getElementById("phrase3").value;
	var date = new Date();
    var pri;
    var stat;
	
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

    if(document.getElementById("NS").checked){
		stat = document.getElementById("NS").value;
	}
	else if(document.getElementById("WiP").checked){
		stat = document.getElementById("WiP").value;
	}
	var atask = new task.Task(tnom, desc, pri, stat, nom, date);
	atask.save();
	window.alert("<<success>> " + atask.taskName);
	document.location="index.html";
    //TODO: send to view this task page
}
