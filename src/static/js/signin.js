
//Partial JS file to deal with the necessary sign-in functions for the html
//    file



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
            login(iden);        
        }else{
            badLoginNotify();
        }
    }else{
        badLoginNotify();
    }

    
    /*
    login takes the identity of the user to be logged in and sets the cookies
    for them keeping them logged in indefinitely until they manually log-out
    */
    function login(iden String){
        
    }

    /*
    badLoginNotify resets the password field and lets the user know that
    they made a mistake
    */
    function badLoginNotify(){
        $('#passwordIn').val("");
        $('#loginStatus').html("Your user name/email or password you entered is incorrect");
    }
}

/*
function identifierCheck(idenEntered String){

Inputs: User name or email entered by user

    the program searches the name/email for the user object in the database
        if(userGiven identifier  == database identifier)
            returns true
        if(userGiven identifier != database identifier)
            returns false
}



function passwordCheck(verifiedIden String, passEntered String){

Inputs: Password entered by user

    the program compares the given password to the user object password
        if(userGiven password == database password)
            returns true

        //This should also apply if the name isnt in the database although 
        //this function probably wont be used that way
        if(userGiven password != database password)
            returns false
}
    
*/













    
