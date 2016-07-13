function setupContextOptions(app) {
    var methodsWithContext = [],
        ctxOption = {
                arg: 'options',
                type: 'object'
            };

    var methods = app.remotes().methods();
    for (var i = 0; i < methods.length; i++) {
         console.log(methods[i].stringName, methods[i].name);
    }

    function inject(ctx, next) {
        console.log('in inject', ctx.method.accepts);
        var options = ctx.args.options || {};
        if (ctx.method.accepts.indexOf(ctxOption) === -1) {
            ctx.method.accepts.push(ctxOption);
        }
        options.accessToken = ctx.req.accessToken;
        ctx.args.options = options;
        next();
    }

    var remotes = app.remotes();
    remotes.methods().forEach(function(method) {
        if(method.sharedClass.ctor.definition.settings.accessTokenEnableCtxOption) {
            console.log('adding options to', method.stringName);
            remotes.before(method.stringName, inject);
            methodsWithContext.push(method.stringName);
        }
    });
}

module.exports = setupContextOptions;
