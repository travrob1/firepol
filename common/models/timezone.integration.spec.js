'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, ngMidwayTester */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('timezone', function() {
    var $scope, doc, _Timezone, injector, theModule;

    beforeEach(function() {
        theModule = angular.module('testApp', ['lbServices'])
            .run(function(Timezone, $rootScope, $injector) {
                $scope = $rootScope.$new(true);
                _Timezone = Timezone;
                injector = $injector;
            });

        angular.element('body').append('<div class="testDiv"></div>');
        doc = angular.element('div.testDiv')[0];
        angular.bootstrap(doc, ['testApp']);
    });
    afterEach(function() {
        angular.element('div.testDiv').remove();
    });
    it('getZones', function(done) {
        injector.invoke(function($timeout) {
            var p = _Timezone.getZones().$promise; 
            p.then(function(data) {
                expect(data.zoneList).to.contain('Pacific/Saipan');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
        //done();
    });
    it('getZones ii', function(done) {
        injector.invoke(function($timeout) {
            var p = _Timezone.getZones().$promise; 
            p.then(function(data) {
                expect(data.zoneList).to.contain('America/Los_Angeles');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
        //done();
    });
});