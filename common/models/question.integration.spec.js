'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach,
    $rootScope, $injector, testIdentifier */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('Question', function() {
    var $scope, Question = $injector.get('Question');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });

    it('can create a Question', function(done) {
        $injector.invoke(function() {
            var c = Question.create({
                'name': 'QuestionName',
                'question': 'Why did the chicken cross the road?',
                'summary': 'Because he was late for school.',
                'details': 'There are two sides to the road.',
                'status': 'preinvite',
                'closingTime': '2016-05-10',
                'votes': 0,
                'responses': 0,
                'views': 0,
                'id': 'test-Question-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });

    it('can find a Question by id', function(done) {
        $injector.invoke(function() {
            var email = 'firepol-itest-' + testIdentifier +'@sky.chrisdavid.com';
            var questionId = 'test-Question-' + testIdentifier;
            function findQuestion(x) {
                Question.findById( {id: questionId})
                    .$promise
                    .then(function(data) {
                        expect(data.name).to.equal('QuestionName');
                        done();
                }, console.error, console.log);
            }
            findQuestion();
        }, this, {$scope: $scope});
    });

    it('can create a Question with reasonable defaults', function(done) {
        $injector.invoke(function() {
            var questionId = 'test-Question2-' + testIdentifier;
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
            function getQuestion() {
                return Question.findById( {id: questionId}).$promise;
            }
            var c = Question.create({
                'name': '',
                'question': '',
                'summary': '',
                'details': '',
                'id': questionId
                });
            c.$promise
                .then(getQuestion, console.error, console.log)
                .then(checkQuestion, console.error, console.log);
        }, this, {$scope: $scope});
    });
});