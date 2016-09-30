'use strict';
var modelHelpers = require('./modelHelpers');

module.exports = function(Post) {
    Post.observe('before save', function(ctx, next) {
        var dataOrInstance = ctx.instance || ctx.data;
        dataOrInstance.indexed = false;
        next();
     });
};
