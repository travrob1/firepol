'use strict';
var modelHelpers = require('./modelHelpers');

module.exports = function(Comment) {
    Comment.observe('before save', function(ctx, next) {
        var accessToken = ctx.options.accessToken;
        var dataOrInstance = ctx.instance || ctx.data;
        dataOrInstance.ownerId = accessToken.userId;
        dataOrInstance.time = Date.now();
        dataOrInstance.indexed = false;
        next();
     });
};
