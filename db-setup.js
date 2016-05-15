'use strict';

var app, Role, RoleMapping,
    Promise = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
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

module.exports = {
    run: function(done) {
        initialize();
        createRoles()
            .then(mapRoles)
            .then(function() { done(); })
            .catch(console.error);
    }
};
