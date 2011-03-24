var signUpPass = false;
var signUpEmail = false;
var signUpEmailAvail = false;
var signUpUserAvail = true;
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
			$('#'+field+'Strength').css('color', '#ff0000');	//red
		}
		else if(first.length < 5) {
			$('#'+field+'Strength').html("Weak");
			$('#'+field+'Strength').css('color', '#ff0000');	//red
		}
		else if(first.length < 8) {
			$('#'+field+'Strength').html("Moderate");
			$('#'+field+'Strength').css('color', '#DDDD00');	//yellow
		}
		else {
			$('#'+field+'Strength').html("Good");
			$('#'+field+'Strength').css('color', '#00ff00');	//green
		}
	}
	
	//compare the first and second input fields
	if(first != second) {
		//if they are not equal set the apropriate div's content and color
		$('#'+field+'Valid').html(field+"'s don't match");
		$('#'+field+'Valid').css('color', '#ff0000');
		
		//since something in the field isnt right we need to disable the submit 
		//button.
		//set the variable associated with the 'field' to false since they dont match
		if(field == "Email")
			signUpEmail = false;
		else if (field == "Password")
			signUpPass = false;
			
		setSubmitButton();
			
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
			$('#'+field+'Valid').css('color', '#00ff00');		//green
			
			//check to see if all the fields are present and set.
			setSubmitButton();
			return true;		
		}
	}		
	return false;
}

function setSubmitButton() {
	if(signUpEmail == true && signUpPass == true && signUpEmailAvail == true && signUpUserAvail == true) {
		//if everything is good then activate the submit button.
		$('#submitButton').removeAttr("disabled")
	}
	else 
		$('#submitButton').attr("disabled", "disabled")
}

function checkAvailability(field, entry) {


	var entry = $('input[id="'+field+'"]').val();
	$.get('Available?'+field+'='+entry, function(data) {
	
		$('#'+field+'Available').html(data);
		if(data.search("Available") >= 0) {
			if(field == 'Email')
				signUpEmailAvail = true;
			else if (field == 'Username')
				signUpUserAvail = true;
				
			//$('#'+field+'Available').html("Available!");
			$('#'+field+'Available').css('color', '#00ff00');		//green

		}
		else {
			if(field == 'Email')
				signUpEmailAvail = false;
			else if (field == 'Username')
				signUpUserAvail = false;
			
			//$('#'+field+'Available').html("Not Available!");
			$('#'+field+'Available').css('color', '#ff0000');		//green

		}
			
	});

	setSubmitButton();

}
