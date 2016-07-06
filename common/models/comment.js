var loopback = require('loopback');

module.exports = function(Comment) {
    var app;
    function getAppReference(cb) {
        function _getAppReference(cb) {
            return function(err, theApp) {
                if (err) console.error(err);
                app = theApp;
                cb();
            };
        }
        if (! app) {
            Comment.getApp(_getAppReference(cb));
        } else {
            cb();
        }
    }
    Comment.observe('before save', function(ctx, next) {
        getAppReference(run);
        function run() {
            var accessToken = loopback.getCurrentContext().active.http.req.accessToken,
                dataOrInstance = ctx.instance || ctx.data;
            if (!accessToken) {
                next(new Error('must be logged in to leave comment'));
            } else {
                
                app.models.Question.findById(dataOrInstance.questionId, setTimestamp)
                function setTimestamp(err, question) {
                    question.updateAttributes({modified: Date.now()});
                }

                dataOrInstance.ownerId = accessToken.userId;
                app.models.FirepolUser.findById(accessToken.userId, function(err, usr){
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
