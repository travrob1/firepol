module.exports = function(FirepolUser) {
    var app, RoleMapping, Role, facilitatorRoleId;
    var avatarColors = ['#000000', '#6FCCDB', '#0696CE', '#FAA41A', '#ED2726', '#7EC242'];

    function getTableReferences(cb) {
        return function(err, theApp) {
            if (err) console.error(err);
            app = theApp;
            RoleMapping = app.models.RoleMapping;
            Role = app.models.Role;
            Role.findOne({where: {name: 'facilitator'}}, getRoleReference(cb));
        };
    }

    function getRoleReference(cb) {
        return function(err, r) {
            if (err) { console.error(err);}
            facilitatorRoleId = r.id;
            console.log('facilitatorRoleId', facilitatorRoleId);
            cb();
        };
    }

    FirepolUser.grantRole = function(id, roleName, cb) {
        if (! app) {
            FirepolUser.getApp(getTableReferences(run));
        } else {
            run();
        }
        function run() {
            if (roleName !== 'facilitator') {
                cb(null, 'invalid rolename');
                return;
            }
            RoleMapping.create({
                principalType: 'USER',
                principalId: id,
                roleId: facilitatorRoleId
            });
            cb(null, 'success');
        }
    };
    FirepolUser.remoteMethod(
        'grantRole',
        {
          accepts: [{arg: 'id', type:'string', required:true}, {arg: 'roleName', type: 'string', required: true}],
          returns: {arg: 'status', type: 'string'},
          http: {path: '/:id/grantRole', verb: 'post'}
        }
    );

    //http://stackoverflow.com/questions/31931084/what-is-the-correct-way-to-change-password-in-angular-strongloop-app
    FirepolUser.updatePassword = function (ctx, oldPassword, newPassword, cb) {
    var newErrMsg, newErr;
    try {
        this.findOne({where: {id: ctx.req.accessToken.userId}}, function (err, user) {
        if (err) {
            cb(err);
        } else if (!user) {
            newErrMsg = 'No match between provided current logged user and email';
            newErr = new Error(newErrMsg);
            newErr.statusCode = 401;
            newErr.code = 'LOGIN_FAILED_EMAIL';
            cb(newErr);
        } else {
            //user.hasPassword(oldPassword, function (err, isMatch) {
            //if (isMatch) {
    
                // TODO ...further verifications should be done here (e.g. non-empty new password, complex enough password etc.)...
    
                user.updateAttributes({'password': newPassword}, function (err, instance) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, true);
                }
                });
                /*
            } else {
                newErrMsg = 'User specified wrong current password !';
                newErr = new Error(newErrMsg);
                newErr.statusCode = 401;
                newErr.code = 'LOGIN_FAILED_PWD';
                return cb(newErr);
            }
            });*/
        }
        });
    } catch (err) {
        console.error(err);
        cb(err);
    }
    };

    FirepolUser.remoteMethod(
        'updatePassword',
        {
            description: 'Allows a logged user to change his/her password.',
            http: {verb: 'put'},
            accepts: [
            {arg: 'ctx', type: 'object', http: {source: 'context'}},
            {arg: 'oldPassword', type: 'string', required: true, description: 'The user old password'},
            {arg: 'newPassword', type: 'string', required: true, description: 'The user NEW password'}
            ],
            returns: {arg: 'passwordChange', type: 'boolean'}
        }
    );


    FirepolUser.observe('before save', function(ctx, next) {
        var dataOrInstance = ctx.instance || ctx.data;
        
        dataOrInstance.fill = avatarColors[Math.floor(Math.random() * 6)];
        dataOrInstance.avatarIndx = Math.floor(Math.random() * 6);
        next();
     });

};
