/* jshint node: true */
'use strict';

const _ = require('lodash');
const db = require('../service/util/dbHelper');

let tshirts = {};

tshirts.addFor = (tshirt, participantId) => {
  return db.insert('insert into tshirts ' +
    '(size, model, participantId) ' +
    'values($1, $2, $3) returning id',
    [tshirt.size,
      tshirt.model,
      participantId]);
};

tshirts.getFor = (participantId) => {
  return db.select('SELECT * FROM tshirts WHERE participantid = $1', [participantId]);
};

tshirts.findAndAddTo = function (participant) {
  return tshirts.getFor(participant.id)
    .then(shirts => {
      if (shirts.length > 0) {
        participant.tshirt = _.pick(shirts[0], ['size', 'model']);
      }
      return participant;
    });
};

module.exports = tshirts;
