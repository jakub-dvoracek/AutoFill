/**
To load AutoFill at a website include this file into the html head or run this script in console:
 var element = document.createElement("script");
 element.src = "<url of this file>";
 document.body.appendChild(element);

Then append GET parameter named "autofill" to the url
For example: http://www.example.com/?autofill

Don´t forget to fill default values to the AF.defaults array!

USAGE:
 - click on any element of a form you want to autofill
 - click the Fill button on left bottom corner
 
*/

var AF_previousFocusedElement;
var AF_currentlyFocusedElement;
var AF = new AutoFill();

alert('AF loaded');

// Fill your default values here
AF.defaults = {
	'email': 'mymail@example.com',
	'phone': '777 888 999',
	'username': 'jakubd-cz',
	'password': 'mojeheslo',
	'firstname': 'Jakub',
	'lastname': 'Dvořáček',
	'street': 'Uliční 83',
	'city': 'Praha',
	'zip': '18000',
	'country': 'Česká republika',
	'generic': 'abc123'
}

$(document).ready(function() {
	
	if(new RegExp('[\\?&](autofill)').exec(window.location.href)) {
		var AF_controlBarr = '<div style="position:absolute;left:0;bottom:0;border:1px solid black;background-color:#C9CCBD;padding:5px">AutoFill <input type="button" name="AF_formFillButton" id="AF_formFillButton" value="Fill"></div>';		
		$('body').append(AF_controlBarr);		
	}
	
	// store last focused element
	$('input, textarea, select').focus(function(){
		AF_previousFocusedElement = AF_currentlyFocusedElement;		
		AF_currentlyFocusedElement = $(this);
	})

	$('input#AF_formFillButton').click(function(){
		var form = $(AF_previousFocusedElement).closest('form');
		if(form.length < 1) {
			alert('No form selected.\nClick inside an element of the form you wish to autofill.');
			return;
		}
		
		$(form).find('input, textarea').each(function(){
			AF.fillElement($(this));
		});
		
		$(form).find('select').each(function(){            
			AF.selectOption($(this));
		});
	})
		
});


function AutoFill() {
	this.defaults = {};
	this.fillElement = function(emt) {
		
		if($(emt).attr('type') == 'text' || $(emt).prop('tagName') == 'TEXTAREA' &&$(emt).val() == '') {
			var elementType = this.guessInputType($(emt).attr('name'));
			
			if($(emt).attr('type') == 'text')
				$(emt).val(this.defaults[elementType]);
			
			if($(emt).prop('tagName') == 'TEXTAREA')
				$(emt).html(this.defaults[elementType]);
		}
		
		if(['radio', 'checkbox'].indexOf($(emt).attr('type')) > -1) {
			$(emt).attr('checked', 'checked');
		}
	}
	
	this.selectOption = function(select) {
		var options = $(select).find('option').each(function() {
			$(this).attr('selected', 'selected');
		})
	}
	
	this.guessInputType = function(emtName) {
		
		// email
		if(new RegExp('(mail)').exec(emtName)) {
			return 'email';
		}
		
		// phone
		else if(new RegExp('(phone|telef)').exec(emtName)) {
			return 'phone';
		}
				
		// lastname
		else if(new RegExp('(lastname|surname|prijmeni|priezvisko|nachname)').exec(emtName)) {
			return 'lastname';
		}
		
		// username
		else if(new RegExp('(username|login|nick)').exec(emtName)) {
			return 'username';
		}
		
		// (first)name
		else if(new RegExp('(name|meno)').exec(emtName)) {
			return 'firstname';
		}
		
		// street
		else if(new RegExp('(street|ulic|Straße)').exec(emtName)) {
			return 'street';
		}
		
		// zip
		else if(new RegExp('(zip|psc|plz|postal)').exec(emtName)) {
			return 'zip';
		}
		
		// city
		else if(new RegExp('(city|town|addres|mesto|adres|stadt)').exec(emtName)) {
			return 'city';
		}
		
		// country
		else if(new RegExp('(country|zeme|staat|stat)').exec(emtName)) {
			return 'country';
		}
		
		// password
		else if(new RegExp('(passwor|heslo)').exec(emtName)) {
			return 'country';
		}
		
		else
			return 'generic';		
	}
}

