'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, $rootScope, $injector */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect,
    testId = Math.random();

describe('Employer', function() {
    var $scope, Employer = $injector.get('Employer');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });
    
    it('can create an employer', function(done) {
        $injector.invoke(function($timeout) {
            var c = Employer.create({
                'Name': 'Santa Ana Enterprises',
                'Address': '457 W. Longfield Rd\nMitor, CA',
                'TimeZone': 'America/Los_Angeles',
                'id': 'test-employer-' + testId
                });
            c.$promise.then(function(data) {
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an employer by id', function(done) {
        $injector.invoke(function($timeout) {
            var p = Employer.findById( {id: 'test-employer-' + testId});
            p.$promise.then(function(data) {
                expect(data.Name).to.equal('Santa Ana Enterprises');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an employer', function(done) {
        $injector.invoke(function($timeout) {
            Employer.find( {filter: {where: {Name:'Santa Ana Enterprises'}, limit: 10}},
                function(data) {
                    expect(data[0].Name).to.equal('Santa Ana Enterprises');
                    done();
                }, console.error );
        }, this, {$scope: $scope});
    });
});