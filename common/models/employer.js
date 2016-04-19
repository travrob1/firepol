'use strict';

var moment = require('moment-timezone'),
    _ = require('lodash');

module.exports = function(Employer) {
    Employer.observe('before save', function(ctx, next) {
        if (! _.includes(moment.tz.names(), ctx.data.TimeZone)) {
            throw new RangeError('invalid timezone'); 
        }
        next();
     });
};
