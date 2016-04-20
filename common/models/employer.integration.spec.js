'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, ngMidwayTester */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect,
    testId = Math.random();

describe('Employer', function() {
    var $scope, doc, _Employer, injector, theModule;

    beforeEach(function() {
        theModule = angular.module('testApp', ['lbServices'])
            .run(function(Employer, $rootScope, $injector) {
                $scope = $rootScope.$new(true);
                _Employer = Employer;
                injector = $injector;
            });

        angular.element('body').append('<div class="testDiv"></div>');
        doc = angular.element('div.testDiv')[0];
        angular.bootstrap(doc, ['testApp']);
    });
    afterEach(function() {
        angular.element('div.testDiv').remove();
    });
    it('can create an employer', function(done) {
        injector.invoke(function($timeout) {
            var c = _Employer.create({
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
        injector.invoke(function($timeout) {
            //var p = _Employer.find( {filter: {limit: 10}} );
            var p = _Employer.findById( {id: 'test-employer-' + testId});
            p.$promise.then(function(data) {
                expect(data.Name).to.equal('Santa Ana Enterprises');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find an employer', function(done) {
        injector.invoke(function($timeout) {
            _Employer.find( {filter: {where: {Name:'Santa Ana Enterprises'}, limit: 10}},
                function(data) {
                    expect(data[0].Name).to.equal('Santa Ana Enterprises');
                    done();
                }, console.error );
        }, this, {$scope: $scope});
    });
});