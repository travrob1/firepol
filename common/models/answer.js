'use strict';

var loopback = require('loopback');
var modelHelpers = require('./modelHelpers');
var _ = require('lodash');

module.exports = function(Answer) {
    Answer.observe('before save', function(ctx, next) {
        function run(app) {
            var accessToken = loopback.getCurrentContext().active.http.req.accessToken,
                dataOrInstance = ctx.instance || ctx.data;
            function calculateAccumulatedAnswer() {
                function calculate(err, answerList) {
                    if (answerList.length < 3) {
                        console.log('skipping answer calculation on ' + dataOrInstance.questionId);
                        return;
                    }
                    var averageAnswer = 0, answerWeight = 0, answer;
                    _.forEach(answerList, function(answer) {
                        var weight = _.get({50: 1, 70: 2, 90: 3, 100: 3}, answer.decisionCertainty, 1);
                        answerWeight += weight;
                        averageAnswer += weight * ( Math.pow(answer.liklihood, 0.1));
                    });
                    answer = Math.floor(Math.pow(averageAnswer / answerWeight, 10));
                    app.models.Question.updateAll({id: dataOrInstance.questionId}, {odds: answer});
                }
/*
                Answer.find({where: modelHelpers.internalApiTokenize({
                        questionId: dataOrInstance.questionId,
                        latest: true})
                    }, calculate);
                    */
                Answer.find({where: {
                        questionId: dataOrInstance.questionId,
                        latest: true}
                    }, calculate);
            }
            if (!accessToken) {
                next(new Error('must be logged in to leave answer'));
            } else {
                if (dataOrInstance.latest === false) {
                    // and here we end the recursion.
                    next();
                } else {
                    dataOrInstance.ownerId = accessToken.userId;
                    dataOrInstance.latest = true;
                    dataOrInstance.time = Date.now();

                    /* this call causes recursion on this this hook */
                    Answer.updateAll({questionId: dataOrInstance.questionId, ownerId: dataOrInstance.ownerId},
                        {latest: false},
                        modelHelpers.logErrorsThenCall(next));
                    // note we've returned our response, and this stuff happens after.
                    modelHelpers.timestamp(app.models.Question, dataOrInstance.questionId);
                    calculateAccumulatedAnswer();
                }
            }
        }
        modelHelpers.getAppReference(Answer).then(run);
     });

    Answer.observe('access', function logQuery(ctx, next) {
        if (! ctx.query.where) {
            ctx.query.where = {};
        }
        // TODO accessToken test may be reducing security.
        //if (! modelHelpers.internalApiConsumeToken(ctx.query.where && ctx.req)) {
        if (ctx.req) {
            ctx.query.where.latest = true;
            ctx.query.where.ownerId = ctx.req.accessToken.userId;
        }
      next();
    });
};
