'use strict';

var app, Role, RoleMapping, FirepolUser, Question,
    user1Id,
    testIdentifier = Math.random(),
        bluebird = require('bluebird');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        FirepolUser = app.models.FirepolUser;
        Question = app.models.Question;
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
    function setUserId(u) {
        user1Id = u.id;
    }
    return bluebird.all([
        FirepolUser.create({username: 'user1'+testIdentifier, email: 'fpuser1'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}).then(setUserId),
        FirepolUser.create({username: 'user2'+testIdentifier, email: 'fpuser2'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}),
        FirepolUser.create({username: 'user3'+testIdentifier, email: 'fpuser3'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}),
        FirepolUser.create({username: 'user4'+testIdentifier, email: 'fpuser4'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'})
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

function createQuestions() {
    var questionTemplate = {
        'name': 'Safety of stairwells',
        'question': 'Should stairwells be the only exit out of buildings with more than 4 stories?',
        'summary': 'Nullam bibendum egestas metus, vitae tincidunt tellus malesuada in. Nunc egestas turpis ac quam pretium interdum. Integer consectetur suscipit augue sed elementum. Nulla efficitur, ex sit amet placerat mattis, urna leo malesuada tellus, in dictum purus dolor eget quam. Sed consectetur, leo quis pellentesque dictum, tortor sem consectetur lectus, quis feugiat risus ante sed eros. Cras eu mattis ipsum, ut condimentum ipsum. Etiam metus ex, iaculis et bibendum at, tincidunt vel augue. Nam feugiat et lectus ac placerat. Fusce quis sollicitudin dolor, vitae convallis augue. Proin suscipit malesuada ligula, et auctor magna scelerisque ut. Ut sit amet dolor a dolor malesuada venenatis et quis mi. Donec a pretium magna.',
        'details': 'Cras sit amet tellus commodo, sagittis lacus et, mollis erat. Nullam laoreet nunc sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mi neque, sollicitudin at tellus a, luctus molestie ligula. Morbi sagittis felis quis purus aliquet, nec vehicula leo tincidunt. Cras vel accumsan mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris tempus suscipit tempus. Praesent sed iaculis enim, nec posuere velit. Aenean semper tortor vel metus consectetur, sollicitudin pretium ex convallis. Nullam a lacinia elit. Sed id orci lectus. In auctor lorem quis interdum blandit. Praesent risus dui, vestibulum ut ultrices tristique, vulputate accumsan sem. Suspendisse et pulvinar massa.',
        'status': 'preinvite',
        'closingTime': '2017-06-10',
        'ownerId': user1Id
    };


    return bluebird.all([
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate),
        Question.create(questionTemplate)
    ]);
}


module.exports = {
    run: function(done) {
        initialize()
            .then(createUsers)
            .then(createQuestions)
            .then(function() { done(); })
            .catch(console.error);
    }
};
