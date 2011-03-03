var extArray = new Array(".gif", ".jpg", ".png");
function LimitAttach(form, file) {
    form.submit();
    /*
	var allowSubmit = false;
	if (!file) return;
	
	while (file.indexOf("\\") != -1) {
		file = file.slice(file.indexOf("\\") + 1);
	}
	var ext = file.slice(file.indexOf(".")).toLowerCase();
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) { 
			allowSubmit = true; 
			i = extArray.length; 
		}
	}
	if (allowSubmit) {
		form.submit();
	} else {
		alert("Please only upload files that end in types:  " + (extArray.join("  ")) + "\nPlease select a new " + "file to upload and submit again.");
	}
    */
}

function PrintAcceptedExts() {
	document.write("Accepted files include: " + extArray.join(", "));
}
