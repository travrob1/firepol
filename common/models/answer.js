var loopback = require('loopback');

module.exports = function(Answer) {
    Answer.observe('before save', function(ctx, next) {
        var userContext = loopback.getCurrentContext(),
            dataOrInstance = ctx.instance || ctx.data;

        dataOrInstance.ownerId = userContext.active.http.req.accessToken.userId;
        if (dataOrInstance.latest === false) {
            next();
        } else {
            dataOrInstance.latest = true;
            dataOrInstance.time = Date.now();

            /* this call causes recursion on this this hook */
            Answer.updateAll({questionId: dataOrInstance.questionId, ownerId: dataOrInstance.ownerId}, {latest: false}, complete);
        }
        function complete(err, info) {
            if(err){console.log(err);}
            next();
        }
     });

    Answer.observe('access', function logQuery(ctx, next) {
        var userContext = loopback.getCurrentContext();

        ctx.query.where.latest = true;
        ctx.query.where.ownerId = userContext.active.http.req.accessToken.userId;
        // console.log('where:', ctx.query.where);
      next();
    });
};
