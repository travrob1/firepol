'use strict';

var app, Role, RoleMapping,
    $q = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
}

function createRoles() {
    return $q.all([
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
                var rm1 = RoleMapping.create({
                    'id': 'rm-facilitator2questionFacilitator',
                    'principalType': 'ROLE',
                    'principalId': 'role-facilitator',
                    'roleId': 'role-questionFacilitator'
                    });
                var rm2 = RoleMapping.create({
                    'id': 'rm-owner2questionFacilitator',
                    'principalType': 'ROLE',
                    'principalId': '$owner',
                    'roleId': 'role-questionFacilitator'
                    });
                return $q.all([rm1.$promise, rm2.$promise]);
}

module.exports = {
    run: function(done) {
        initialize();
        createRoles()
            .then(done)
            .catch(console.error);
    }
};
