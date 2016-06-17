var loopback = require('loopback');

module.exports = function(Comment) {
    var app;
    function getAppReference(cb) {
        return function(err, theApp) {
            if (err) console.error(err);
            app = theApp;
            cb();
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
                app.models.FirepolUser.findById(userId, function(err, usr){
                    if(usr){
                        dataOrInstance.name = usr.username;
                    }
                    next();
                });

            }
            dataOrInstance.time = Date.now();
        }
     });
};
