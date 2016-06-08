/**

PREREQUESITES
 - jquery library
 - link this file in your html head

USAGE:
 - click on any element of a form you want to autofill
 - click the Fill button at right-top corner
 
*/

var AF_previousFocusedElement;
var AF_currentlyFocusedElement;
var AF = new AutoFill();

// Fill your default values here
AF.defaults = {
	'email': 'my@email.com',
	'phone': '777 888 999',
	'username': 'my_user',
	'password': 'my_password',
	'firstname': 'Firstname',
	'lastname': 'Lastname',
	'street': 'Stret 23',
	'city': 'Prague',
	'zip': '18000',
	'country': 'Czech republic',
	'number': '2',
	'ic': '12345678',
	'dic': 'CZ123456789',
	'generic': 'test data...',
	'date': function() {
		
		// Try to recognize page language
		var metaLanguage = $('meta[http-equiv="Content-Language"]');
		if (metaLanguage.length > 0)
			var lang = $(metaLanguage).attr('content')
		else if ($('html').attr('lang') !== 'undefined') 
			var lang = $('html').attr('lang')
			
		else if($('html').attr('xml:lang') !== 'undefined') {
			var lang = $('html').attr('lang');
			var lang = lang.substring(0, 1);
		}		
		if(lang.length > 2)
			var lang = lang.substring(0, 2);
			
		var today = new Date();
		var dd    = today.getDate();
		var mm    = today.getMonth() + 1;
		var yyyy  = today.getFullYear();
		
		
		// see http://en.wikipedia.org/wiki/Date_format_by_country
		if(lang == 'cs')
			var date = dd +'.'+ mm +'.'+ yyyy;
		else
			var date = yyyy +'-'+ mm +'-'+ dd;
						
		return date;
	}	
}

$(document).ready(function() {
	
	if(new RegExp('[\\?&](autofill)').exec(window.location.href)) {
		var AF_controlBarr = '<div style="position:fixed;right:0;top:0;border:2px solid #768C48;background-color:#CEF680;padding:5px;font-weight:bold-webkit-box-shadow:-3px 3px 8px 0px rgba(50,50,50,0.75);-moz-box-shadow:-3px 3px 8px 0px rgba(50,50,50,0.75);box-shadow:-3px 3px 8px 0px rgba(50,50,50,0.75);">AutoFill <input type="button" name="AF_formFillButton" id="AF_formFillButton" value="Fill"></div>';		
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
		else if(new RegExp('(phone|cellphone|telefon|mobil|mobilni_cislo|telefoni_cislo)').exec(emtName)) {
			return 'phone';
		}
				
		// lastname
		else if(new RegExp('(lastname|surname|prijmeni|priezvisko|nachname)').exec(emtName)) {
			return 'lastname';
		}
		
		// username
		else if(new RegExp('(username|^login|^nick)').exec(emtName)) {
			return 'username';
		}
		
		// (first)name
		else if(new RegExp('(^name|^meno|^jmeno|krestni_jmeno|firstname)').exec(emtName)) {
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
		else if(new RegExp('(country|zeme|^staat|^stat)').exec(emtName)) {
			return 'country';
		}
		
		// number
		else if(new RegExp('(^num|count|qty|quantity|^zahl|^menge|^quant)').exec(emtName)) {
			return 'number';
		}
		
		// password
		else if(new RegExp('(passwor|heslo)').exec(emtName)) {
			return 'country';
		}
		
		// date
		if(new RegExp('(^date|datum|^data)').exec(emtName)) {
			return 'date';
		}
		
		// dic
		if(new RegExp('(^dic|danove_identifikacni_cislo)').exec(emtName)) {
			return 'dic';
		}
		
		// ic
		if(new RegExp('(^ic|^ico|identifikacni_cislo)').exec(emtName)) {
			return 'ic';
		}
		
		else {
			return 'generic';
		}
	}
}
