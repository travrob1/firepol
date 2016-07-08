'use strict';
var loopback = require('loopback');
var modelHelpers = require('./modelHelpers');

module.exports = function(Comment) {
    Comment.observe('before save', function(ctx, next) {
        function run(app) {
            var currentContext = loopback.getCurrentContext(),
                accessToken = currentContext && currentContext.active.http.req.accessToken,
                dataOrInstance = ctx.instance || ctx.data;
            if (! currentContext) {
                // assuming we are coming in from db-seed or other non HTTP client.
            } else if (!accessToken) {
                next(new Error('must be logged in to leave comment'));
            } else {
                modelHelpers.timestamp(app.models.Question, dataOrInstance.questionId);
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
        modelHelpers.getAppReference(Comment).then(run);
     });
};
