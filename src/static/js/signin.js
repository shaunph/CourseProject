
/*
When the user hits the 'login' button the hitLogin function is called. The value
of the identity and password are checked against the database and if they are 
both correct then the login function is called and the user is signed in. If one
or the other are incorrect then the badLoginNotify function is called and the 
user is given an error.
*/
function hitLogin(){

    // Variables to grab the strings within the text fields
    var iden = $('#identityIn').val();
    var pass = $('#passwordIn').val();

    // If construct to determine whether to login or give an error
    if(identifierCheck(iden)){
        if (passwordCheck(iden, pass)){
            $('#loginStatus').html("got this far");
            //getReq = function(request, response){

                
                
                
                
            //}        
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

        //var dbIden = (query database to find the iden, either email or name)
        var dbIden = "holder"

        if(iden == dbIden){
            return true;
        }else{
            return false;
        }
    }

    //passwordCheck takes the user given idenifier and password and matches
    //the password to the one in the database user
    function passwordCheck(iden, pass){

        //var dbPass = (query database to find the password for the iden)
        var dbPass = "holder"

        if(pass == dbPass){
            return true;
        }else{
            return false;
		}
    }   
}













    
