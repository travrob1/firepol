module.exports = function(Comment) {
    Comment.observe('before save', function(ctx, next) {
        next();
        return;
        if (ctx.instance && ! ctx.instance.ownerId ||
              ctx.data && !ctx.data.ownerId ) {
            var err = new Error('Comment must have an ownerId');
            err.statusCode = 400;
            console.error(err.toString(), ctx.instance);
            next(err);
        } else {
            next();
        }
     });

};
