'use strict';

var moment = require('moment-timezone'),
    _ = require('lodash');

module.exports = function(Employer) {
    Employer.observe('before save', function(ctx, next) {
        var employer = ctx.data || ctx.instance;
        if (! _.includes(moment.tz.names(), employer.timezone)) {
            throw new RangeError('invalid timezone'); 
        }
        next();
     });
};
