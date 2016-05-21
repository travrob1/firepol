module.exports = function(Answer) {
    Answer.observe('before save', function(ctx, next) {
        if (ctx.instance && ! ctx.instance.ownerId ||
              ctx.data && !ctx.data.ownerId ) {
            var err = new Error('Answer must have an ownerId');
            err.statusCode = 400;
            console.error(err.toString(), ctx.instance);
            next(err);
        } else {
            next();
        }
     });
};
