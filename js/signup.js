var signUpPass = false;
var signUpEmail = false;
var signUpValid = false
/*
 * This function is used to verify if the text in two different fields match.
 * field is the name of the field to validate.  The field to be validated with
 * must have the name 'field'Conf.  So in short this function will compare 
 * 'field' with 'field'Conf and if they are not equal then it will change the
 * div with the name 'field'NotValid to inline and the div with the name 
 * 'field'Valid to none.
 */
function verify(field) {

	//the first and second text field to compare with
	var first = $('input[id="'+field+'"]').val();
	var second = $('input[id="'+field+'Conf"]').val();
	
	if (field == "Password") {
		if (first.length < 1) {
			$('#'+field+'Strength').html("Too Short");
			$('#'+field+'Strength').css('color', '#ff0000');
		}
		else if(first.length < 5) {
			$('#'+field+'Strength').html("Weak");
			$('#'+field+'Strength').css('color', '#ff0000');
		}
		else if(first.length < 8) {
			$('#'+field+'Strength').html("Moderate");
			$('#'+field+'Strength').css('color', '#ffff00');
		}
		else {
			$('#'+field+'Strength').html("Good");
			$('#'+field+'Strength').css('color', '#00ff00');
		}
	}
	
	//compare the first and second input fields
	if(first != second) {
		//if they are not equal set the apropriate div's content and color
		$('#'+field+'Valid').html(field+"'s don't match");
		$('#'+field+'Valid').css('color', '#ff0000');
		
		//since something in the field isnt right we need to disable the submit 
		//button.
		$('#submitButton').attr("disabled","disabled");
		//set the variable associated with the 'field' to false since they dont match
		if(field == "Email")
			signUpEmail = false;
		else if (field == "Password")
			signUpPass = false;
		//exit the function.
		return false;
	}
	else {
		//if the fields do match.
		if(field == "Email")
			signUpEmail = true;
		else if (field == "Password")
			signUpPass = true;
				
		if(first.length > 0) {
			//set the div display status
			$('#'+field+'Valid').html("Match!");
			$('#'+field+'Valid').css('color', '#00ff00');
			
			//check to see if all the fields are present and set.
			if(signUpEmail == true && signUpPass == true) {
				//if everything is good then activate the submit button.
				$('#submitButton').removeAttr("disabled")
			}
			return true;		
		}
	}		
	return false;
}