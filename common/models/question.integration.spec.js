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
        emailAdmin = 'fpadmin@sky.chrisdavid.com',
        email1 = 'fpfacilitator@sky.chrisdavid.com',
        commentId1 = 'comment-' + testIdentifier,
        commentId2 = 'comment2-' + testIdentifier,
        questionId1;

    function loginAdmin() {
        return FirepolUser
            .login({ rememberMe: true },{email: emailAdmin, password: 'admin4231', ttl: 1000 })
            .$promise;
    }

    function loginFacilitator() {
        return FirepolUser
            .login({ rememberMe: true },{email: email1, password: 'zigmore', ttl: 1000 })
            .$promise;
    }

    function logout() {
        console.log('logging out');
        return FirepolUser
            .logout()
            .$promise;
    }

    function findQuestion1() {
        console.log('findQuestion1');
        return Question.findById( {id: questionId1})
            .$promise;
    }

    function findComment1() {
        console.log('findComment1');
        return Question.Comments.findById({id: questionId1, fk: commentId1})
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

    it('needs a facilitator to create questions', function(done) {
        function createUser() {
            console.log('creating user with facilitator rights');
            return FirepolUser.create({
                'name': 'A. Facilitator',
                'username': 'test-facilitator',
                'password': 'zigmore',
                'email': email1
                }).$promise;
        }
        function assignFacilitatorRole(u) {
            debugger;
            return FirepolUser.grantRole({id: u.id, roleName: 'facilitator'}).$promise;
        }
            $q.resolve(true)
                .then(loginAdmin, Dconsole.error, console.log)
                .then(createUser, Dconsole.error, console.log)
                .then(assignFacilitatorRole, Dconsole.error, console.log)
                .then(function() { done(); })
                .catch(function(err) {
                    Dconsole.log(err);
                    expect(true).to.be.false;
                    done();
                });
    });

    it('can be created with authentication', function(done) {
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginFacilitator, Dconsole.error, console.log)
                .then(createQuestion, Dconsole.error, console.log)
                .then(function() { done(); })
                .catch(function(err) {
                    Dconsole.log(err);
                    expect(true).to.be.false;
                    done();
                });

            function createQuestion(u) {
                console.log('creating: ' + questionId1);
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
                    'ownerId': u.userId
                    })
                    .$promise.then(function(q) {
                        questionId1 = q.id;
                        return q;
                    });
            }
        }, this, {$scope: $scope});
    });

    it('can be found', function(done) {
        $injector.invoke(function() {
            loginFacilitator()
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
            loginFacilitator()
                .then(createQuestion, Dconsole.error, Dconsole.log)
                .then(findQuestion, Dconsole.error, console.log)
                .then(checkQuestion, Dconsole.error, console.log);
            function createQuestion(u) {
                console.log('creating: ' + questionId2);
                return Question.create({
                'name': '',
                'question': '',
                'summary': '',
                'details': '',
                'ownerId': u.userId
                }).$promise.then(function(q) {
                    questionId2 = q.id;
                    return q;
                });
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
                .then(loginFacilitator, Dconsole.error, console.log)
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
                .then(findQuestion1, Dconsole.error, console.log)
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

    it('should allow another user to place a comment', function(done) {
        var currentUserId, questionId;
        function placeCommentOnQuestion1(q) {
            questionId = q.id;
            return Question.Comments.create({
                'id': questionId}, {
                'text': 'we think BOCA 2012 part 16 is not pertinent to this situation.',
                'ownerId': currentUserId
            })
            .$promise.then(function(c) {
                commentId1 = c.id;
                return c;
            });
        }
        function placeAnotherCommentOnQuestion1(q) {
            return Question.Comments.create(
                { 'id': questionId},
                {
                    'text': 'we think BOCA 2012 part 16 IS pertinent to this situation.',
                    'ownerId': currentUserId
                })
            .$promise.then(function(c) {
                commentId2 = c.id;
                return c;
            });
        }
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginAnotherUser, Dconsole.error, console.log)
                .then(function(u) { currentUserId = u.userId; return u;})
                .then(findQuestion1, Dconsole.error, console.log)
                .then(placeCommentOnQuestion1, Dconsole.error, console.log)
                .then(function(c) {
                    expect(c.questionId).to.equal(questionId1);
                    expect(c.ownerId).to.equal(currentUserId);
                    expect(c.id).to.equal(commentId1);
                })
                .then(placeAnotherCommentOnQuestion1, Dconsole.error, console.log)
                .then(function(c) {
                    expect(c.questionId).to.equal(questionId1);
                    expect(c.ownerId).to.equal(currentUserId);
                    expect(c.id).to.equal(commentId2);
                    done();
                })
                .catch(function(e) {
                    Dconsole.log(e);
                    expect(true).to.be.false;
                    done();
                });
        }, this, {$scope: $scope});
    });
    it('comment should have a correct questionID', function(done) {
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginAnotherUser, Dconsole.error, console.log)
                .then(findComment1)
                .then(function(c) {
                    expect(c.questionId).to.equal(questionId1);
                    done();
                })
                .catch(function(e) {
                    console.log(e);
                    expect(true).to.be.false;
                    done();
                });
        }, this, {$scope: $scope});
    });
    it('should allow a comment without an ownerId', function(done) {
        var questionId, userId;
        function placeCommentOnQuestion1(q) {
            questionId = q.id;
            return Question.Comments.create({
                'id': questionId}, {
                'text': 'who do I think I am...'
            })
            .$promise;
        }

        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginFacilitator, Dconsole.error, console.log)
                .then(function(u) { userId = u.userId;})
                .then(findQuestion1, Dconsole.error, console.log)
                .then(placeCommentOnQuestion1)
                .then(function(c) {
                    expect(c.ownerId).to.equal(userId);
                    done();
                });
        }, this, {$scope: $scope});
    });

    it('should allow an answer without an ownerId', function(done) {
        var questionId, userId;
        function placeAnswerOnQuestion1(q) {
            questionId = q.id;
            return Question.Answers.create({
                'id': questionId}, {
                'liklihood': 0.1,
                'liklihoodAcceptance': 0.1,
                'decisionCertainty': 0.1
            })
            .$promise;
        }

        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginFacilitator, Dconsole.error, console.log)
                .then(function(u) { userId = u.userId;})
                .then(findQuestion1, Dconsole.error, console.log)
                .then(placeAnswerOnQuestion1)
                .then(function(a) {
                    expect(a.ownerId).to.equal(userId);
                    done();
                });
        }, this, {$scope: $scope});
    });

    it('should allow answers to be placed', function(done) {
        var currentUserId, questionId, answerId1, answerId2;
        function placeAnswerOnQuestion1(q) {
            questionId = q.id;
            return Question.Answers.create({
                'id': questionId}, {
                'liklihood': 0.5,
                'liklihoodAcceptance': 0.5,
                'decisionCertainty': 0.8
            })
            .$promise.then(function(a) {
                answerId1 = a.id;
                return a;
            });
        }
        function placeAnswer2OnQuestion1(q) {
            return Question.Answers.create({
                'id': questionId}, {
                'liklihood': 0.6,
                'liklihoodAcceptance': 0.3,
                'decisionCertainty': 1.0
            })
            .$promise.then(function(a) {
                answerId2 = a.id;
                return a;
            });
        }
        $injector.invoke(function() {
            $q.resolve(true)
                .then(loginAnotherUser, Dconsole.error, console.log)
                .then(function(u) { currentUserId = u.userId; return u;})
                .then(findQuestion1, Dconsole.error, console.log)
                .then(placeAnswerOnQuestion1, Dconsole.error, console.log)
                .then(function(a) {
                    expect(a.questionId).to.equal(questionId1);
                    expect(a.ownerId).to.equal(currentUserId);
                    expect(a.id).to.equal(answerId1);
                })
                .then(placeAnswer2OnQuestion1, Dconsole.error, console.log)
                .then(function(a) {
                    expect(a.questionId).to.equal(questionId1);
                    expect(a.ownerId).to.equal(currentUserId);
                    expect(a.id).to.equal(answerId2);
                    done();
                })
                .catch(function(e) {
                    Dconsole.log(e);
                    expect(true).to.be.false;
                    done();
                });
        }, this, {$scope: $scope});
    });

    it('will logout', function() {
        logout();
        expect(true).to.be.true;
    });
});