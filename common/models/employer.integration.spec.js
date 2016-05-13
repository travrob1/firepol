'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach,
    $rootScope, $injector, testIdentifier */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('Employer', function() {
    var $scope, Employer = $injector.get('Employer');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });
    
    it('can be created', function(done) {
        $injector.invoke(function($timeout) {
            var c = Employer.create({
                'name': 'Santa Ana Enterprises',
                'address': '457 W. Longfield Rd\nMitor, CA',
                'timezone': 'America/Los_Angeles',
                'id': 'test-employer-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can be found by employer id', function(done) {
        $injector.invoke(function($timeout) {
            var p = Employer.findById( {id: 'test-employer-' + testIdentifier});
            p.$promise.then(function(data) {
                expect(data.name).to.equal('Santa Ana Enterprises');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('be found by name', function(done) {
        $injector.invoke(function($timeout) {
            Employer.find( {filter: {where: {name:'Santa Ana Enterprises'}, limit: 10}},
                function(data) {
                    expect(data[0].name).to.equal('Santa Ana Enterprises');
                    done();
                }, console.error );
        }, this, {$scope: $scope});
    });
});