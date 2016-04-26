'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, $rootScope, $injector, testIdentifier, apiErrorHandler, _ */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('User', function() {
    var $scope, User = $injector.get('User');
    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });

    it('can create a User', function(done) {
        $injector.invoke(function($timeout) {
            var c = User.create({
                'realm': 'string',
                'username': 'user' + testIdentifier,
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'foo' + testIdentifier + '@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26',
                'id': 'test-User-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });

    it('cannot create a User with duplicate username', function(done) {
        $injector.invoke(function($timeout) {
            var c = User.create({
                'realm': 'string',
                'username': 'user' + testIdentifier,
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'foob' + testIdentifier + '@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26',
                'id': 'test-User-' + testIdentifier
                });
            c.$promise.then(apiErrorHandler, function(data) {
                done();
            }, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });

    it('cannot create a User with duplicate email', function(done) {
        $injector.invoke(function($timeout) {
            var c = User.create({
                'realm': 'string',
                'username': 'userb' + testIdentifier,
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'foo' + testIdentifier + '@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26',
                'id': 'test-User-' + testIdentifier
                });
            c.$promise.then(apiErrorHandler, function(data) {
                done();
            }, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });

    it('can find an User by id', function(done) {
        $injector.invoke(function($timeout) {
            var p = User.findById( {id: 'test-User-' + testIdentifier});
            p.$promise.then(function(data) {
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an User by username', function(done) {
        $injector.invoke(function($timeout) {
            User.find( {filter: {where: {username:'user' + testIdentifier}, limit: 10}},
                function(data) {
                    expect(data[0].Name).to.equal('user' + testIdentifier);
                    done();
                }, apiErrorHandler );
        }, this, {$scope: $scope});
    });

});

describe('UserProfile', function() {
    var $scope, UserProfile = $injector.get('UserProfile');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });
    
    it('can get the UI definition', function(done) {
        $injector.invoke(function($timeout) {
            var p = UserProfile.getUserProfileDefinition().$promise; 
            p.then(function(data) {
                expect(data.userProfileDefinition).to.exist;
                expect(data.userProfileDefinition).to.be.an.array;
                _.forEach(data.userProfileDefinition, function(def) {
                    expect(data.userProfileDefinition[0].member).to.exist;
                });
                //expect(data.listEducationLevel.usls).to.equal('less than highschool');
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
    });
    it('fails when creating a UserProfile without a userId', function(done) {
        $injector.invoke(function($timeout) {
            var c = UserProfile.create({
                'id': 'test-UserProfile-' + testIdentifier
                });
            c.$promise.then(apiErrorHandler, function() {
                done();
            }, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });
    it('can create a UserProfile with all nulls, except the userId', function(done) {
        $injector.invoke(function($timeout) {
            var c = UserProfile.create({
                'id': 'test-UserProfile-' + testIdentifier,
                'userId': 'test-User-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });
    it('can find an UserProfile by id', function(done) {
        $injector.invoke(function($timeout) {
            var p = UserProfile.findById( {id: 'test-UserProfile-' + testIdentifier});
            p.$promise.then(function(data) {
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
    });
});