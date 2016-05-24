var loopback = require('loopback');

module.exports = function(Answer) {
    Answer.observe('before save', function(ctx, next) {
        var userContext = loopback.getCurrentContext(),
            dataOrInstance = ctx.instance || ctx.data;
        dataOrInstance.ownerId = userContext.active.http.req.accessToken.userId;
        dataOrInstance.time = Date.now();
        next();
     });
};
