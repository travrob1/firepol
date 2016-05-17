'use strict';

var app, Role, RoleMapping, User,
        bluebird = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        User = app.models.FirepolUser;
}

function createRoles() {
    return bluebird.all([
        Role.create({
            'name': 'questionFacilitator',
            'description': 'should be facilitator and owner'
            }),
        Role.create({
            'name': 'facilitator',
            'description': 'just a facilitator'
            })
    ]);
}

function mapRoles() {
    return bluebird.all([
        RoleMapping.create({
            'id': 'rm-facilitator2questionFacilitator',
            'principalType': 'ROLE',
            'principalId': 'role-facilitator',
            'roleId': 'role-questionFacilitator'
            }),
        RoleMapping.create({
            'id': 'rm-owner2questionFacilitator',
            'principalType': 'ROLE',
            'principalId': '$owner',
            'roleId': 'role-questionFacilitator'
            })
     ]);
}

function createFacilitator() {
    console.log('creating facilitator');
    return User.create({email: 'facilitator@f.com', 'password': 'testp'});
}
function assignFacilitatorRole(u) {
    console.log(u);
    Role.findOne({where: {name: 'facilitator'}}, assignRole);
    function assignRole(err, role) {
        err && console.err(err);
        console.log(role);
        return role.principals.create({
            principalType: RoleMapping.USER,
            principalId: u.id
        });
    }
    return;
    Role.findOne({where: {id: 'role-questionFacilitator'}}, cb);
    function cb(err, role) {
        err && console.err(err);
        return role.principals.create({
            principalType: RoleMapping.USER,
            principalId: u.id
        });
    }
}

module.exports = {
    run: function(done) {
        var userId;
        initialize();
        createRoles()
//            .then(mapRoles)
            .then(createFacilitator)
            .then(assignFacilitatorRole)
            .then(function() { done(); })
            .catch(console.error);
    }
};
