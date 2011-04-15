/* 
   TODO: Search via name as well
*/
function looking() {

    if(document.getElementById("phrase2").value == ""){
        window.alert("Please Enter search parameters");
    }
    else {
	document.location="/searchResult?p1="+ document.getElementById("phrase2").value;
    }
}
