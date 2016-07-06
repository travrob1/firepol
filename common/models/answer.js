var loopback = require('loopback');

module.exports = function(Answer) {
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
            Answer.getApp(_getAppReference(cb));
        } else {
            cb();
        }
    }

    Answer.observe('before save', function(ctx, next) {
        getAppReference(run);
        function run(){
            var accessToken = loopback.getCurrentContext().active.http.req.accessToken,
                dataOrInstance = ctx.instance || ctx.data;
                console.log(accessToken);
            if (!accessToken) {
                next(new Error('must be logged in to leave answer'));
            } else {
                        
                dataOrInstance.ownerId = accessToken.userId;
                
                function setTimestamp(err, question){
                    question.updateAttributes({modified: Date.now()});
                }

                if (dataOrInstance.latest === false) {
                    next();
                } else {
                    app.models.Question.findById(dataOrInstance.questionId, setTimestamp);
                    dataOrInstance.latest = true;
                    dataOrInstance.time = Date.now();

                    /* this call causes recursion on this this hook */
                    Answer.updateAll({questionId: dataOrInstance.questionId, ownerId: dataOrInstance.ownerId}, {latest: false}, complete);
                }
                function complete(err, info) {
                    if(err){console.log(err);}
                    next();
                }
            }
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
