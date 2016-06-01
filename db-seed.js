'use strict';

var app, Role, RoleMapping, FirepolUser,
        bluebird = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        FirepolUser = app.models.FirepolUser;
        return bluebird.resolve();
}

function createRoles() {
    return bluebird.all([
        Role.create({
            'name': 'facilitator',
            'description': 'just a facilitator'
            })
    ]);
}

function createUsers() {
    return bluebird.all([
        FirepolUser.create({username: 'user1', email: 'fpuser1@sky.chrisdavid.com', 'password': 'user4231'}),
        FirepolUser.create({username: 'user2', email: 'fpuser2@sky.chrisdavid.com', 'password': 'user4231'}),
        FirepolUser.create({username: 'user3', email: 'fpuser3@sky.chrisdavid.com', 'password': 'user4231'}),
        FirepolUser.create({username: 'user4', email: 'fpuser4@sky.chrisdavid.com', 'password': 'user4231'})
    ]);
}

function assignFacilitatorRole(u) {
    Role.findOne({where: {name: 'facilitator'}}, assignRole);
    function assignRole(err, role) {
        if (err) { console.err(err); }
        return role.principals.create({
            principalType: RoleMapping.USER,
            principalId: u.id
        });
    }
}

module.exports = {
    run: function(done) {
        initialize()
            .then(createUsers)
            //.then(createQuestions)
            .then(function() { done(); })
            .catch(console.error);
    }
};
