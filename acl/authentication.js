/* jshint node: true */
'use strict';

let isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/login');
    }
};

module.exports = isAuthenticated;