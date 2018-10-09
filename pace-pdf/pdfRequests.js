/* jshint node: true */
'use strict';
let pdf = require('./pdf/pdfGeneration');
let pdfRequests = {};

pdfRequests.setup = (redis) => {
  redis.subscribe('pace-pdf', (err, count) => {});
  redis.on('message', pdfRequests.process);
};

pdfRequests.process = (channnel, msg) => {
  pdf.generate(pdfRequests.parse(msg));
};

pdfRequests.parse = (message) => {
 return JSON.parse(message);
};

module.exports = pdfRequests;
