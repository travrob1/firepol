
module.exports = function(Question) {
    Question.observe('before save', function(ctx, next) {
        //var dataOrInstance = ctx.instance || ctx.data;

        //dataOrInstance.modified = Date.now();
        next();
     });
};
