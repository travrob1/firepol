function setupContext(app) {
    // var methods = app.remotes().methods();
    // for (var i = 0; i < methods.length; i++) {
    //     console.log(methods[i].stringName, methods[i].name);
    // }

    function inject(ctx, next) {
        var options = hasOptions(ctx.method.accepts) && (ctx.args.options || {});
        if(options) {
            options.accessToken = ctx.req.accessToken;
            ctx.args.options = options;
        }
        next();
    }

    function hasOptions(accepts) {
        for (var i = 0; i < accepts.length; i++) {
            var argDesc = accepts[i];
            if (argDesc.arg === 'options' && argDesc.injectCtx) {
                return true;
            }
        }
        return false;
    }

    var remotes = app.remotes();
    remotes.methods().forEach(function(method) {
        if(!hasOptions(method.accepts) && method.sharedClass.ctor.definition.settings.accessTokenEnableCtxOption) {
            console.log('adding options to', method.stringName);
            remotes.before(method.stringName, inject);
            method.accepts.push({
                arg: 'options',
                type: 'object',
                injectCtx: true
            });
        }
    });
}

module.exports = setupContext;
