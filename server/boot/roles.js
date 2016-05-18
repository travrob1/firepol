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
        
        // check if userId is in team table for the given project id
        context.model.findById(context.modelId, function(err, modelInstance) {
            if (err || !modelInstance) {
                return reject(err);
            }
            if (context.modelName === 'Question') {
                cb(null, modelInstance.status !== 'preinvite');
            } else if (context.modelName === 'Comment') {
                cb(null, true);
            } else {
                return reject(err);
            }
        });
    });
};