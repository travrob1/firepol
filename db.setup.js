'use strict';

var app = require('server/server'),
    Role = app.models.Role,
    RoleMapping = app.models.RoleMapping;


function createRoles() {
    Role.create({
        'id': 'role-questionFacilitator',
        'name': 'questionFacilitator',
        'description': 'should be facilitator and owner'
        });
    Role.create({
        'id': 'role-facilitator',
        'name': 'facilitator',
        'description': 'just a facilitator'
        });
}
            function roleMappings() {
                var rm1 = RoleMapping.create({
                    'id': 'rm-rf2rfqf-' + testIdentifier,
                    'principalType': 'ROLE',
                    'principalId': 'rf-' + testIdentifier,
                    'roleId': 'rfqf-' + testIdentifier
                    });
                var rm2 = RoleMapping.create({
                    'id': 'rm-owner2rfqf-' + testIdentifier,
                    'principalType': 'ROLE',
                    'principalId': '$owner',
                    'roleId': 'rfqf-' + testIdentifier
                    });
                return $q.all([rm1.$promise, rm2.$promise]);
            }
            $q.all([rfqf.$promsise, rf.$promise, c.$promise])
                .then(roleMappings, Dconsole.error, Dconsole.log)
                .then(done, Dconsole.error, Dconsole.log);

module.exports = {
    run: function(done) {
    }
}
