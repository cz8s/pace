/* jshint node: true */
'use strict';
const db = require('../service/util/dbHelper');
const moment = require('moment');
const _ = require('lodash');

const defaultColor = '#FFFFFF';
const isHexColor = /(^#[0-9A-Fa-f]{6}$)|(^#[0-9A-Fa-f]{3}$)/i;

let startblocks = {};

startblocks.add = (time, name, color) => {
  color = isHexColor.test(color) ? color : defaultColor;
  return db.insert('INSERT INTO startblocks(start_time,name, color) values($1,$2,$3) returning id', [time, name, color]);
};

startblocks.editBlock = (time, name, color, id) => {
  return db.update('UPDATE startblocks set start_time=$1,name=$2, color=$3 where id=$4', [time, name, color, id]);
};

startblocks.save = (req) => {
  _.each(req.block,block => {
    let time = moment().hours(block.hours).minutes(block.minutes).seconds(block.seconds).unix();
    if (block.id != 0) {
      startblocks.editBlock(time, block.name, block.color, block.id);
    } else {
      if (block.hours != '') {
        startblocks.add(time, block.name, block.color);
      }
    }
  });
};

startblocks.times = () => {
  return db.select('SELECT start_time from startblocks order by id')
  .then((blocks) => {
    _.each(blocks, (block, i) => {
      blocks[i] = block.start_time;
    });
    return blocks;
  });
};

startblocks.all = () => {
 return db.select('SELECT id,color from startblocks order by id');
};

startblocks.get = () => {
  return db.select('SELECT * from startblocks order by id').then((blocks) => {
    _.each(blocks, (block, i) => {
      blocks[i].hours = moment(block.start_time, 'X').hours();
      blocks[i].minutes = moment(block.start_time, 'X').minutes();
      blocks[i].seconds = moment(block.start_time, 'X').seconds();
    });
    return blocks;
  });
};

module.exports = startblocks;
