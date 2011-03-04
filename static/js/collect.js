function initialize() {
	document.title = "Add A Task";
	document.getElementById("low").checked=true;
}

function clicked() {

	for(i = 2; i< 5; i++){
		if(document.getElementById("phrase"+i).value == ""){
			window.alert("Not all required fields are properly filled");
			return;
		}
	}

	var name = "J Doe";
	var desc = document.getElementById("phrase2");
	var ETR = document.getElementById("phrase3");
	var ETL = document.getElementById("phrase4");
	var com = document.getElementById("phrase5");

	if(document.getElementById("low").checked){
		pri = document.getElementById("low").value;
	}
	else if(document.getElementById("medium").checked){
		pri = document.getElementById("medium").value;
	}
	else if(document.getElementById("high").checked){
		pri = document.getElementById("high").value;
	}
	window.alert("success");
}
