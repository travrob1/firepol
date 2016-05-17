'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach,
    $rootScope, $injector, testIdentifier, Dconsole */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe.only('Question', function() {
    var $scope,
        FirepolUser = $injector.get('FirepolUser'),
        Question = $injector.get('Question'),
        $q = $injector.get('$q'),
        email = 'facilitator@f.com';

    function createFirepolUser() {
        console.log('create');
        return FirepolUser.create({
            'name': 'A. ' + testIdentifier,
            'username': 'zaggmore'  + testIdentifier,
            'password': 'zigless',
            'email': 'regularUser-' + testIdentifier + '@f.com'
            }).$promise;
    }
    function loginFirepolUser() {
        console.log('login');
        /*
        return FirepolUser
            .login({ rememberMe: true },{username: 'zaggmore'  + testIdentifier, password: 'zigless', ttl: 1000 })
            .$promise; */
        return FirepolUser
            .login({ rememberMe: true },{email: email, password: 'testp', ttl: 1000 })
            .$promise;
    }

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });

    it('can be created with authentication', function(done) {
        $injector.invoke(function() {
            $q.resolve(true)
                //.then(createFirepolUser, Dconsole.error, console.log)
                .then(loginFirepolUser, Dconsole.error, console.log)
                .then(createQuestion, Dconsole.error, console.log)
                .then(function() { done(); })
                .catch(function(err) {
                    Dconsole.log(err);
                    expect(true).to.be.false;
                    done();
                });

            function createQuestion(u) {
                console.log('creating question' );
                return Question.create({
                    'name': 'QuestionName',
                    'question': 'Why did the chicken cross the road?',
                    'summary': 'Because he was late for school.',
                    'details': 'There are two sides to the road.',
                    'status': 'preinvite',
                    'closingTime': '2016-05-10',
                    'votes': 0,
                    'responses': 0,
                    'views': 0,
                    'ownerId': u.id,
                    'id': 'test-Question-' + testIdentifier
                    })
                    .$promise;
            }
        }, this, {$scope: $scope});
    });

    it('can be found', function(done) {
        $injector.invoke(function() {
            var questionId = 'test-Question-' + testIdentifier;
            loginFirepolUser()
                .then(findQuestion, Dconsole.error, Dconsole.log)
                .then(test, Dconsole.error, console.log);
            function findQuestion() {
                return Question.findById( {id: questionId}).$promise;
            }
            function test(data) {
                expect(data.name).to.equal('QuestionName');
                done();
            }
        }, this, {$scope: $scope});
    });

    it('can be created with reasonable defaults', function(done) {
        $injector.invoke(function() {
            var questionId = 'test-Question2-' + testIdentifier;
            loginFirepolUser()
                .then(createQuestion, Dconsole.error, Dconsole.log)
                .then(findQuestion, Dconsole.error, console.log)
                .then(checkQuestion, Dconsole.error, console.log);
            function createQuestion() {
                return Question.create({
                'name': '',
                'question': '',
                'summary': '',
                'details': '',
                'id': questionId
                }).$promise;
            }
            function findQuestion() {
                return Question.findById( {id: questionId})
                    .$promise;
            }
            function checkQuestion(data) {
                expect(data.name).to.equal('');
                expect(data.question).to.equal('');
                expect(data.summary).to.equal('');
                expect(data.details).to.equal('');
                expect(data.status).to.equal('preinvite');
                expect(data.closingTime).to.equal(undefined);
                expect(data.votes).to.equal(0);
                expect(data.responses).to.equal(0);
                expect(data.views).to.equal(0);
                done();
            }
        }, this, {$scope: $scope});
    });
});