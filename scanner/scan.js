const readline = require('readline');
const config = require('config');
const request = require('request');
const LinuxInputListener = require('linux-input-device');

var apiurl = config.get('pace-url')+'/api/scan';
var keylist = [2,3,4,5,6,7,8,9,10,11]
var number = {};
var events = config.get('events')
var input = {};
events.forEach(function(event) {
 input[event] = new LinuxInputListener('/dev/input/event'+event);
 input[event].on('state', function(value, key, kind) {
	if (value == true) {
		handle_keys(key,event)
	}
   });
});

function handle_keys(key,event) {
 if (keylist.indexOf(key) >= 0)  {
      number[event] = "" + number[event] + (key-1)
    }
    if (key == 28) {
	console.log(number[event]);
	number[event] = '';
    }
};

