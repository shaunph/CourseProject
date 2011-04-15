/* clicked is called by addtask.html when the user attempts to submit their fields.
   It scans the required fields (all but comments) and terminates process if the fields
   are incomplete. If complete, it currently displays a success box and links to the main
   page and creates a task object using Chris's task.js file.
   TODO: use server and link to database 
*/
function clicked(form) {
    for(i = 2; i< 6; i++){
        if(document.getElementById("phrase"+i).value == ""){
            window.alert("Not all required fields are properly filled");
            return;
        }
    }

    if (document.getElementById("phrase2").value.length > 20) {
	window.alert("task name is too long"); 
        return;
    }
    if (document.getElementById("phrase3").value.length > 750) {
	window.alert("Description is too long"); 
        return;
    }
    if (document.getElementById("phrase4").value.length > 10) {
	window.alert("ETR is too long"); 
        return;
    }
    if (document.getElementById("phrase5").value.length > 10) {
	window.alert("Time spent is too long"); 
        return;
    }
    if (document.getElementById("prog").value.length > 20) {
	window.alert("progress description is too long");         
        return;
    }


    if(!document.getElementById("low").checked){
    if(!document.getElementById("medium").checked){
            if(!document.getElementById("high").checked){
        window.alert("Not all required fields are properly filled");
                return;    
            }
    }
    }

    if(document.getElementById("prog").value == ""){
	document.getElementById("prog").value = "Not Started";
    }  

    var ETR = document.getElementById("phrase4").value;
    var ETL = document.getElementById("phrase5").value;

    if(isNaN(parseFloat(ETR)) || isNaN(parseFloat(ETL))){
        window.alert("Time field entries must be a number");
        return;
    }
    form.submit();
}
