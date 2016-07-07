'use strict';
var loopback = require('loopback');
var modelHelpers = require('./modelHelpers');

module.exports = function(Answer) {
    Answer.observe('before save', function(ctx, next) {
        function run(app) {
            var accessToken = loopback.getCurrentContext().active.http.req.accessToken,
                dataOrInstance = ctx.instance || ctx.data;
                console.log(accessToken);
            if (!accessToken) {
                next(new Error('must be logged in to leave answer'));
            } else {
                if (dataOrInstance.latest === false) {
                    // and here we end the recursion.
                    next();
                } else {
                    modelHelpers.timestamp(app.models.Question, dataOrInstance.questionId);
                    dataOrInstance.ownerId = accessToken.userId;
                    dataOrInstance.latest = true;
                    dataOrInstance.time = Date.now();

                    /* this call causes recursion on this this hook */
                    console.log('about to recurse');
                    Answer.updateAll({questionId: dataOrInstance.questionId, ownerId: dataOrInstance.ownerId},
                        {latest: false},
                        modelHelpers.logErrorsThenCall(next));
                }
            }
        }
        modelHelpers.getAppReference(Answer).then(run);
     });

    Answer.observe('access', function logQuery(ctx, next) {
        var userContext = loopback.getCurrentContext();

        ctx.query.where.latest = true;
        ctx.query.where.ownerId = userContext.active.http.req.accessToken.userId;
        // console.log('where:', ctx.query.where);
      next();
    });
};
