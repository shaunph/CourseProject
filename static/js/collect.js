//var task = require("task");

function initialize() {
	document.title = "Add A Task";
	document.getElementById("low").checked=true;
}

function clicked() {

	for(i = 2; i< 6; i++){
		if(document.getElementById("phrase"+i).value == ""){
			window.alert("Not all required fields are properly filled");
			return;
		}
	}

	var nom = "J Doe";
	var tnom = document.getElementById("phrase2");
	var desc = document.getElementById("phrase3");
	var ETR = document.getElementById("phrase4");
	var ETL = document.getElementById("phrase5");
	var com = document.getElementById("phrase6");
	var date = new Date();

	if(document.getElementById("low").checked){
		pri = document.getElementById("low").value;
	}
	else if(document.getElementById("medium").checked){
		pri = document.getElementById("medium").value;
	}
	else if(document.getElementById("high").checked){
		pri = document.getElementById("high").value;
	}
	//t = new Task(tnom, desc, pri, "open", nom, date);
	window.alert("<<success>> " + date);
	document.location="index.html"
}
