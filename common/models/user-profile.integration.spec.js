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
    
    it('can list a few userProfile properties', function(done) {
        debugger;
        console.log(UserProfile.getEducationLevel);
        $injector.invoke(function($timeout) {
            var p = UserProfile.getEducationLevel().$promise; 
            p.then(function(data) {
                expect(data.listEducationLevel.usls).to.equal('less than highschool');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    
    return;
    it('can create an UserProfile', function(done) {
        $injector.invoke(function($timeout) {
            var c = UserProfile.create({
                'Name': 'Santa Ana Enterprises',
                'Address': '457 W. Longfield Rd\nMitor, CA',
                'TimeZone': 'America/Los_Angeles',
                'id': 'test-UserProfile-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an UserProfile by id', function(done) {
        $injector.invoke(function($timeout) {
            var p = UserProfile.findById( {id: 'test-UserProfile-' + testIdentifier});
            p.$promise.then(function(data) {
                expect(data.Name).to.equal('Santa Ana Enterprises');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an UserProfile', function(done) {
        $injector.invoke(function($timeout) {
            UserProfile.find( {filter: {where: {Name:'Santa Ana Enterprises'}, limit: 10}},
                function(data) {
                    expect(data[0].Name).to.equal('Santa Ana Enterprises');
                    done();
                }, console.error );
        }, this, {$scope: $scope});
    });
});