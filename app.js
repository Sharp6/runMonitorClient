var request = require('request');
var piblaster = require('pi-blaster.js');

var RED_GPIO_PIN = 17;
var GREEN_GPIO_PIN = 18;

function getStatus() {
	request('https://runmonitor.herokuapp.com/check', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
			return body;
	  }
	});
}

function convertStatusToColor(status) {
	var red;
	var green;
	switch(status) {
		case 0:
			red = 0;
			green = 255;
			break;
		case 1:
			red = 100;
			green = 200;
		case 2: 
			red = 200;
			green = 100;
		case 3: 
			red = 255;
			green = 0;
		default:
			red = 255;
			green = 0;
	}
	var color = {
		red: red,
		green: green
	}
	return color;
}

function setRgbLed(color) {
	piblaster.setPwm(RED_GPIO_PIN, color.red/255);
	piblaster.setPwm(GREEN_GPIO_PIN, color.green/255);
}

function doAtInterval() {
	var status = getStatus();
	var color = convertStatusToColor(status);
	setRgbLed(color);
	console.log(color);
}

setInterval(doAtInterval, 1000);
