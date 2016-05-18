'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach,
    $rootScope, $injector, testIdentifier, Dconsole */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('Question', function() {
    var $scope,
        FirepolUser = $injector.get('FirepolUser'),
        Question = $injector.get('Question'),
        $q = $injector.get('$q'),
        email1 = 'facilitator@f.com',
        questionId1 = 'test-Question-' + testIdentifier;


    function loginFirepolUser() {
        /*
        return FirepolUser
            .login({ rememberMe: true },{username: 'zaggmore'  + testIdentifier, password: 'zigless', ttl: 1000 })
            .$promise; */
        return FirepolUser
            .login({ rememberMe: true },{email: email1, password: 'testp', ttl: 1000 })
            .$promise;
    }

    function findQuestion1() {
        console.log('findQuestion1');
        return Question.findById( {id: questionId1})
            .$promise;
    }

    var email2 = 'regularUser-' + testIdentifier + '@f.com';
    function loginAnotherUser() {
        console.log('loginAnotherUser');
        return FirepolUser
            .login({ rememberMe: true },{email: email2, password: 'zigless', ttl: 1000 })
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
                    'ownerId': u.userId,
                    'id': 'test-Question-' + testIdentifier
                    })
                    .$promise;
            }
        }, this, {$scope: $scope});
    });

    it('can be found', function(done) {
        $injector.invoke(function() {
            loginFirepolUser()
                .then(findQuestion, Dconsole.error, Dconsole.log)
                .then(test, Dconsole.error, console.log);
            function findQuestion() {
                return Question.findById( {id: questionId1}).$promise;
            }
            function test(data) {
                expect(data.name).to.equal('QuestionName');
                done();
            }
        }, this, {$scope: $scope});
    });

    it('can be created with reasonable defaults', function(done) {
        $injector.invoke(function() {
            var questionId2 = 'test-Question2-' + testIdentifier;
            loginFirepolUser()
                .then(createQuestion, Dconsole.error, Dconsole.log)
                .then(findQuestion, Dconsole.error, console.log)
                .then(checkQuestion, Dconsole.error, console.log);
            function createQuestion(u) {
                return Question.create({
                'name': '',
                'question': '',
                'summary': '',
                'details': '',
                'ownerId': u.userId,
                'id': questionId2
                }).$promise;
            }
            function findQuestion() {
                return Question.findById( {id: questionId2})
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

    it('another user cannot access the question', function(done) {
        function createAnotherUser() {
            console.log('creating user without rights');
            return FirepolUser.create({
                'name': 'A. ' + testIdentifier,
                'username': 'zaggmore'  + testIdentifier,
                'password': 'zigless',
                'email': email2
                }).$promise;
        }
        $injector.invoke(function() {
            $q.resolve(true)
                .then(createAnotherUser, Dconsole.error, console.log)
                .then(loginAnotherUser, Dconsole.error, console.log)
                .then((findQuestion1), Dconsole.error, console.log)
                .then(function() {
                    expect(true).to.be.false;
                })
                .catch(function(e) {
//                    console.log(e);
                    expect(true).to.be.true;
                    done();
                });
        }, this, {$scope: $scope});
    });

    it('can be set into active ', function(done) {
        function setQuestion1Active(q) {
            q.status = 'active';
            return q.$save();
        }
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginFirepolUser, Dconsole.error, console.log)
                .then(findQuestion1, Dconsole.error, console.log)
                .then(setQuestion1Active)
                .then(function(q) {
                    expect(q.status).to.equal('active');
                    done();
                 });
        }, this, {$scope: $scope});
    });

    it('should allow another user to access', function(done) {
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginAnotherUser, Dconsole.error, console.log)
                .then((findQuestion1), Dconsole.error, console.log)
                .then(function() {
                    expect(true).to.be.true;
                    done();
                })
                .catch(function(e) {
                    console.log(e);
                    expect(true).to.be.false;
                    done();
                });
        }, this, {$scope: $scope});
    });
});