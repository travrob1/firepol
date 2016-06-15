'use strict';


var app, Role, RoleMapping, FirepolUser, Question, Comment,
    userList = [],
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
        userList.push(u);
    }
    return bluebird.all([
        FirepolUser.findOrCreate({where: {username: 'user1'}}, {name:'Don Appleseed', username: 'user1', email: 'fpuser1@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.findOrCreate({where: {username: 'user2'}}, {name:'Joe Golani', username: 'user2', email: 'fpuser2@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.findOrCreate({where: {username: 'user3'}}, {name:'fancy fire', username: 'user3', email: 'fpuser3@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),
        FirepolUser.findOrCreate({where: {username: 'user4'}}, {name:'joey12', username: 'user4', email: 'fpuser4@sky.chrisdavid.com', 'password': 'user4231'}).then(rememberUser),

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
    function questionTemplate(question) {
        return {
            'question': question,
            'details': 'Cras sit amet tellus commodo, sagittis lacus et, mollis erat. Nullam laoreet nunc sem. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris mi neque, sollicitudin at tellus a, luctus molestie ligula. Morbi sagittis felis quis purus aliquet, nec vehicula leo tincidunt. Cras vel accumsan mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris tempus suscipit tempus. Praesent sed iaculis enim, nec posuere velit. Aenean semper tortor vel metus consectetur, sollicitudin pretium ex convallis. Nullam a lacinia elit. Sed id orci lectus. In auctor lorem quis interdum blandit. Praesent risus dui, vestibulum ut ultrices tristique, vulputate accumsan sem. Suspendisse et pulvinar massa.',
            'status': 'preinvite',
            'closingTime': '2017-06-10',
            'ownerId': userList[0].id
        };
    }
    var idx=0;
    var questionList = [
        'Should stairwells be the only exit out of buildings with more than 4 stories?',
        'Would 1 gallon of gasoline in 5 gallon container potentially explode bad enough to cause a fatality on a stage that has pyrotechnics?',
        'Should a warehouse be shutdown while the foam system is under repair?',
        'Could stairwells positioned 203 feet, which is 3 feet over code, be a significant risk factor?',
        'Would fire department dry pipes without covers and stuffed with garbage pose a fatal risk?',
        'Does stacking paper products 20 feet high pose a fatal risk if the sprinkler head density in increased by a factor of 4?',
        'What is the minimum distance stick built structures should be seperated by in order to prevent fire from moving from once structure to the next?',
        'Do fire department spigot valves need working handles given that Fire Departments generally carry tools to turn the stem of the spigot?',
        'Does a stick built complex of buildings require security to prevent arson?',
        'Should residential sprinklers be checked after sitting dormant in a home for 35 years?',
        'Does an alarm system require battery backup at a power generation facility?',
        'What defensable distance should be maintained between a oil & gas shale extraction facility and surrounding forest?',
    ];
    var questions = questionList.map(function(q) {
        var filter = {where: {question: q}};
        var template = questionTemplate(q);
        return Question.findOrCreate(filter, template);
    });
    return bluebird.all(questions);
}

function addComments(qList) {
    var userIdx = 0;
    function comment(questionId, inReferenceTo) {
        var c = {questionId: questionId,
                 ownerId: userList[userIdx][0].id,
                 name: userList[userIdx][0].name,
                 text: 'E un fapt bine stabilit că cititorul va fi sustras de conţinutul citibil al unei pagini atunci când se uită la aşezarea în pagină. Scopul utilizării a Lorem Ipsum, este acela că are o distribuţie a literelor mai mult sau mai puţin normale, faţă de utilizarea a ceva de genul Conţinutaici, conţinut acolo.'};
        if (inReferenceTo) {
            c.inReferenceTo = inReferenceTo;
        }
        userIdx += 1;
        userIdx %= userList.length;
        return c;
    }
    function addReply(c) {
        return Comment.create(comment(c.questionId, c.id));
    }

    var commentTasks = qList.map(function(qu) {
        var q = qu[0];
        var c = comment(q.id);
        return Comment.create(c)
            .then(addReply);
    });
    //console.log(commentTasks);
    return;// bluebird.all(commentTasks);
}

module.exports = {
    run: function(done) {
        initialize()
            .then(createUsers)
            .then(createQuestions)
            .then(addComments)
            .then(function() {
                console.log('paste this into mongo to delete many tables');
                console.log('db.Answer.drop(); db.Comment.drop(); db.FirepolUser.drop(); db.UserProfile.drop(); db.accessToken.drop(); db.userIdentity.drop(); db.Question.drop();');
                done();
            })
            .catch(console.error);
    }
};
