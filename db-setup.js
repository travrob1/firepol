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
            'name': 'facilitator',
            'description': 'just a facilitator'
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
}

module.exports = {
    run: function(done) {
        var userId;
        initialize();
        createRoles()
            .then(createFacilitator)
            .then(assignFacilitatorRole)
            .then(function() { done(); })
            .catch(console.error);
    }
};
