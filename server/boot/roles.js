module.exports = function(app) {
    var Role = app.models.Role;
    Role.registerResolver('$invitee', function(role, context, cb) {
        function reject(err) {
            if (err) {
                return cb(err);
            }
            cb(null, false);
        }

        var userId = context.accessToken.userId;
        if (!userId) {
            return reject(); // do not allow anonymous users
        }
        //console.log(context.modelName, context.modelId, context.property, context.method);
        if (context.property === '__create__Comments' ||
            context.property === '__create__Answers') {
            cb(null, true);
            return;
        }
        if (context.accessType !== 'READ') {
            cb(null, false);
            return;
        }

        // check if userId is in team table for the given project id
        context.model.findById(context.modelId, function(err, modelInstance) {
            if (err || !modelInstance) {
                //console.log(context.modelName, context.modelId, 'rejecting', err, modelInstance);
                return reject(err);
            }
            if (context.modelName === 'Question') {
                cb(null, modelInstance.status !== 'preinvite');
            } else {
                //console.log(context.modelName, 'rejecting');
                return reject();
            }
        });
    });
    /*  just for debugging...
    Role.registerResolver('$$invitee', function(role, context, cb) {
        console.log('$$invitee', context.modelName, context.modelId, context.property, context.method);
        cb(null, true);
    });
    */
};