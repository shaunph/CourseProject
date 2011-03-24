/*
Author: Mitchell Ludwig
*/
//Filters file uploads to accept only gif, jpg and png images.
var extArray = new Array("zip", "rar", "js", "html", "htm", "jpg", "jpeg", "png", "gif", "bmp", "txt", "css");
function LimitAttach(form, file) {
	if (!file) {
        return; //If there is no file, don't submit anything
    }
	
    //Extract the file extension
	var ext = file.split(".").pop();
    //See if it is an accepted file type
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) { 
            //If it was accepted, then submit the form and exit
            form.submit();
			return;
		}
	}
    //Otherwise, pop up a messagebox with a warning and don't submit the form
    alert("Accepted file types are " + extArray.join(", "));
	
}

//Prints the accepted file extensions.
function PrintAcceptedExts() {
	document.write("Accepted files include: " + extArray.join(", "));
}
