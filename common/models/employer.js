'use strict';

var moment = require('moment-timezone'),
    _ = require('lodash');

module.exports = function(Employer) {
    Employer.observe('before save', function(ctx, next) {
        var employer = ctx.data || ctx.instance;
        console.log(ctx);
        if (! _.includes(moment.tz.names(), employer.TimeZone)) {
            throw new RangeError('invalid timezone'); 
        }
        next();
     });
};
