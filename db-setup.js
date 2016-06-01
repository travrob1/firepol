'use strict';

/* minimal DB setup to create an admin user which can bootstrap the rest of the users */

var app, Role, RoleMapping, FirepolUser,
        bluebird = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        FirepolUser = app.models.FirepolUser;
        return bluebird.resolve();
}

function resolve(deferred) {
    return function(err, data) {
        if (err) { console.error(err);}
        return deferred.resolve(data);
    };
}

function wrap(f) {
    var d = bluebird.defer();
    f(resolve(d));
    return d.promise;
}

function createRoles() {
    var f = wrap(function(resolveCb) {
            Role.findOrCreate({
                'name': 'facilitator',
                'description': 'just a facilitator'
                }, resolveCb);
        }),
        a = wrap(function(resolveCb) {
            Role.findOrCreate({
                'name': 'admin',
                'description': 'administrator with many rights'
                }, resolveCb);
        });
    return bluebird.all([f, a]).promise;
}

function createAdminUser() {
    return wrap(function(resolve) {
        FirepolUser.findOrCreate({where: {username: 'admin'}},
            {username: 'admin', email: 'fpadmin@sky.chrisdavid.com', 'password': 'admin4231'},
            resolve);
    });
}

function assignAdminRole(u) {
    return wrap(function(resolveCb) {
        Role.findOne({where: {name: 'admin'}}, resolveCb);
    }).then(assignRole);

    function assignRole(role) {
        return wrap(function(resolveCb) {
            role.principals.create({
                principalType: RoleMapping.USER,
                principalId: u.id
            }, resolveCb);
        });
    }
}

module.exports = {
    run: function(done) {
        initialize()
            .then(createRoles)
            .then(createAdminUser)
            .then(assignAdminRole)
            .then(function() { done(); })
            .catch(console.error);
    }
};
