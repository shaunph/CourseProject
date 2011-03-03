/*
Author: Mitchell Ludwig
*/
//Filters file uploads to accept only gif, jpg and png images.
var extArray = new Array(".gif", ".jpg", ".png");
function LimitAttach(form, file) {
    var allowSubmit = false;
	if (!file) return; //If there is no file, don't submit anything
	
    //Extract the file name and extension
	while (file.indexOf("\\") != -1) {
		file = file.slice(file.indexOf("\\") + 1);
	}
    //Extract the file extension
	var ext = file.slice(file.indexOf(".")).toLowerCase();
    //See if it is an accepted file type
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) { 
			allowSubmit = true; 
			i = extArray.length; 
		}
	}
    //If it was accepted, then submit the form
	if (allowSubmit) {
		form.submit();
	} else {
        //Otherwise, pop up a messagebox with a warning and don't submit the form
		alert("Accepted file types are " + extArray.join(", "));
	}
}

//Prints the accepted file extensions.
function PrintAcceptedExts() {
	document.write("Accepted files include: " + extArray.join(", "));
}
