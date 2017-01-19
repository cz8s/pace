let moment = require('moment')
let starttime = moment().hours(10).minutes(0).seconds(0).unix();

var dbm = global.dbm || require('db-migrate');

exports.up = function(db, callback) {
  db.runSql("alter table participants drop column time", callback);
};

exports.down = function(db, callback) {
  db.addColumn('participants', 'time', {type: 'bigint'}, callback);
};
