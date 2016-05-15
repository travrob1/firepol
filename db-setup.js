'use strict';

var app, Role, RoleMapping, User,
    Promise = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        User = app.models.User;
}

function createRoles() {
    return Promise.all([
        Role.create({
            'id': 'role-questionFacilitator',
            'name': 'questionFacilitator',
            'description': 'should be facilitator and owner'
            }),
        Role.create({
            'id': 'role-facilitator',
            'name': 'facilitator',
            'description': 'just a facilitator'
            })
    ]);
}

function mapRoles() {
    return Promise.all([
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
    return User.create({id: 'user-facilitator', username: 'facilitator', email: 'facilitator@f.com', 'password': 'testp'})
}
function assignFacilitatorRole() {
    Role.findOne({where: {id: 'role-questionFacilitator'}}, cb);
    function cb(err, role) {
        err && console.err(err);
        return role.principals.create({
            principalType: RoleMapping.USER,
            principalId: 'user-facilitator'
        });
    }
}

module.exports = {
    run: function(done) {
        initialize();
        createRoles()
            .then(mapRoles)
            .then(createFacilitator)
            .then(assignFacilitatorRole)
            .then(function() { done(); })
            .catch(console.error);
    }
};
