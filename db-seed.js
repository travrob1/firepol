'use strict';


var app, Role, RoleMapping, FirepolUser, Question, Comment,
    user1Id,
    userIdList = [],
    testIdentifier = Math.random(),
    bluebird = require('bluebird'),
    _ = require('lodash');

function initialize() {
        app = require('./server/server');
        Role = app.models.Role;
        RoleMapping = app.models.RoleMapping;
        FirepolUser = app.models.FirepolUser;
        Question = app.models.Question;
        Comment = app.models.Comment;
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
    function rememberUser(u) {
        userIdList.push(u.id);
    }
    return bluebird.all([
        FirepolUser.create({username: 'user1'+testIdentifier, email: 'fpuser1'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.create({username: 'user2'+testIdentifier, email: 'fpuser2'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.create({username: 'user3'+testIdentifier, email: 'fpuser3'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.create({username: 'user4'+testIdentifier, email: 'fpuser4'+testIdentifier+'@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser)
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

function addComments(qList) {
    var userIdx = 0;
    var commentTemplate = {
        text: 'E un fapt bine stabilit că cititorul va fi sustras de conţinutul citibil al unei pagini atunci când se uită la aşezarea în pagină. Scopul utilizării a Lorem Ipsum, este acela că are o distribuţie a literelor mai mult sau mai puţin normale, faţă de utilizarea a ceva de genul Conţinutaici, conţinut acolo.'
    };
    function comment(questionId, inReferenceTo) {
        var c = _.assign({questionId: questionId, ownerId: userIdList[userIdx]}, commentTemplate);
        if (inReferenceTo) {
            c.inReferenceTo = inReferenceTo;
        }
        userIdx += 1;
        userIdx %= userIdList.length;
        return c;
    }
    function addReply(c) {
        return Comment.create(comment(c.questionId, c.id));
    }
    var commentTasks = [];
    _.forEach(qList, applyComments);
    function applyComments(q) {
        commentTasks.push(
            Comment.create(comment(q.id))
                .then(addReply)
        );
    }
}

module.exports = {
    run: function(done) {
        initialize()
            .then(createUsers)
            .then(createQuestions)
            .then(addComments)
            .then(function() { done(); })
            .catch(console.error);
    }
};
