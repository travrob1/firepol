'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, ngMidwayTester, $injector, $rootScope, testIdentifier */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('timezone', function() {
    var $scope, Timezone = $injector.get('Timezone');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });

    it('getZones', function(done) {
        $injector.invoke(function($timeout) {
            var p = Timezone.getZones().$promise; 
            p.then(function(data) {
                expect(data.listTimezone).to.contain('Pacific/Saipan');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
    it('getZones ii', function(done) {
        $injector.invoke(function($timeout) {
            var p = Timezone.getZones().$promise; 
            p.then(function(data) {
                expect(data.listTimezone).to.contain('America/Los_Angeles');
                done();
            }, console.error, console.log);
        }, this, {$scope: $scope});
    });
});