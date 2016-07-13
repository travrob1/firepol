'use strict';
var modelHelpers = require('./modelHelpers');

module.exports = function(Comment) {
    Comment.observe('before save', function(ctx, next) {
        function run(app) {
            console.log('comment ctx options', ctx.options);
            var accessToken = ctx.options.accessToken;
            var dataOrInstance = ctx.instance || ctx.data;
            if (accessToken === null) {
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
