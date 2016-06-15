var loopback = require('loopback');

module.exports = function(Comment) {
    var app;
    function getAppReference(cb) {
        return function(err, theApp) {
            if (err) console.error(err);
            app = theApp;
        };
    }
    Comment.observe('before save', function(ctx, next) {
        if (! app) {
            Comment.getApp(getAppReference(run));
        } else {
            run();
        }
        function run() {
            var userContext = loopback.getCurrentContext(),
                dataOrInstance = ctx.instance || ctx.data;
            if (userContext) {
                var userId = userContext.active.http.req.accessToken.userId;
                dataOrInstance.ownerId = userId;
                dataOrInstance.name = app.FirepolUser({id: userId}).username;
            }
            dataOrInstance.time = Date.now();
            next();
        }
     });
};
