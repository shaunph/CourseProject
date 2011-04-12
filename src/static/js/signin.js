
/*
signin.js first confirms that the information the user submits is in the 
database, and then enables the submit button.
*/
function hitLogin(field, url){

	$.get(url, function(data) {
		$('#' + field.html(data);
	});







    // Variables to grab the strings within the text fields
    var iden = $('#identityIn').val();
    var pass = $('#passwordIn').val();

    // If construct to determine whether to login or give an error
    if(identifierCheck(iden)){
        if (passwordCheck(iden, pass)){
            loginButton.disabled = false; //remove?
        }else{
            badLoginNotify();
        }
    }else{
        badLoginNotify();
    }
    

    //badLoginNotify resets the password field and lets the user know that
    //they made a mistake
    function badLoginNotify(){
        $('#passwordIn').val("");
        $('#loginStatus').html("Your user name/email or password you entered is incorrect");
    }

	//identiferCheck takes the user given identifier and returns whether it
	//matches the user identifier in the database
    function identifierCheck(iden){
		return true;
/*
        //var dbIden = (query database to find the iden, either email or name)
        var dbIden = "asdf"

        if(iden == dbIden){
            return true;
        }else{
            return false;
        }
*/
    }

    //passwordCheck takes the user given idenifier and password and matches
    //the password to the one in the database user
    function passwordCheck(iden, pass){
		return true;
/*
        //var dbPass = (query database to find the password for the iden)
        var dbPass = "asdf"

        if(pass == dbPass){
            return true;
        }else{
            return false;
		}
*/
    }   
}













    
