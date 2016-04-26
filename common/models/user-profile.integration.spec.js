'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, $rootScope, $injector, testIdentifier */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('UserProfile', function() {
    var $scope, UserProfile = $injector.get('UserProfile');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });
    
    function apiErrorHandler(err) {
        console.error(JSON.stringify(err, null, 4));
    }
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
                'id': 'test-UserProfile-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });
    return;
    it('can find an UserProfile by id', function(done) {
        $injector.invoke(function($timeout) {
            var p = UserProfile.findById( {id: 'test-UserProfile-' + testIdentifier});
            p.$promise.then(function(data) {
                expect(data.Name).to.equal('Santa Ana Enterprises');
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an UserProfile', function(done) {
        $injector.invoke(function($timeout) {
            UserProfile.find( {filter: {where: {Name:'Santa Ana Enterprises'}, limit: 10}},
                function(data) {
                    expect(data[0].Name).to.equal('Santa Ana Enterprises');
                    done();
                }, apiErrorHandler );
        }, this, {$scope: $scope});
    });
});