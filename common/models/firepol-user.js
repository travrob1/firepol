module.exports = function(FirepolUser) {
    var app, RoleMapping, Role, facilitatorRoleId;

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

    console.log('very early');
    FirepolUser.grantRole = function(id, roleName, cb) {
        console.log('how about here created mapping');
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
            console.log('created mapping');
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

    return;
    FirepolUser.revokeRole = function(roleName, cb) {
      cb(null, moment.tz.names());
    };
    FirepolUser.remoteMethod(
        'revokeRole',
        {
          accepts: {arg: 'roleName', type: 'string'},
          returns: {arg: 'status', type: 'string'}
        }
    );

};
