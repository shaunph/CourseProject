/* 
   TODO: Search via name as well
*/
function looking() {

    if(document.getElementById("phrase2").value == ""){
        window.alert("Please Enter an ID");
    }
    else {
	document.location="/task?id="+ document.getElementById("phrase2").value;
    }
}
