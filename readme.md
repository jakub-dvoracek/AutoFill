AutoFill is used for automatic filling of form fields on a webpage.

To load AutoFill on a page include this file into html head or run this three lines in console:
 var element = document.createElement("script");
 element.src = "<url pointing to this file>";
 document.body.appendChild(element);

Then append GET parameter named "autofill" to the url

For example: http://www.example.com/?autofill

Don´t forget to fill default values to the AF.defaults array!

USAGE:
 - click on any element of a form you want to autofill
 - click the Fill button in the lower left corner
 
