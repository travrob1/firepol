'use strict';

var moment = require('moment-timezone');

module.exports = function(Employer) {
    Employer.observe('before save', function(ctx, next) {
        console.log(ctx.data);
        next();
        return;
        if (ctx.options && ctx.options.skipPropertyFilter) return next();
        if (ctx.instance) {
            FILTERED_PROPERTIES.forEach(function(p) { ctx.instance.unsetAttribute(p); });
        } else {
            FILTERED_PROPERTIES.forEach(function(p) { delete ctx.data[p]; });
        }
     });
};
