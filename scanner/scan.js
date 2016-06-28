const readline = require('readline');
const config = require('config');
const request = require('request');

var apiurl = config.get('pace-url')+'/api/scan';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    request.post(apiurl, {form:{startnumber:input,time:Date.now()}})
    .on('response', function(response) {
      console.log(response.statusCode) // 200 
    })
    .on('error', function(err) {
       console.log(err)
    })
});

