'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, ngMidwayTester */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('timezone', function() {
    var tester,
        $compile, $scope, doc, _Timezone, injector,
        theModule = angular.module('testApp', ['lbServices'])
            .run(function(Timezone, $rootScope, $injector) {
                $scope = $rootScope.$new(true);
                _Timezone = Timezone;
                console.log(Timezone);
                injector = $injector;
                console.log(injector);
            });

    angular.element('body').append('<div class="testDiv"></div>');
    doc = angular.element('div.testDiv')[0];
    angular.bootstrap(doc, ['testApp']);

    beforeEach(function() {
        //tester = ngMidwayTester('testApp');
        
        //$scope = angular.injector().get('$rootScope').$new(true);
        //$compile = angular.injector().get('$compile');
        return;
        console.log(document);
        console.log();
        console.log(theModule);
        $scope = angular.injector().get('$rootScope').$new(true);
        $compile = angular.injector().get('$compile');
    });
    afterEach(function() {
        //tester.destroy();
        //$scope.destroy();
    });
    it('a test', function(done) {
        console.log('test');
        injector.invoke(function($timeout) {
            var p = _Timezone.getZones().$promise; 
            console.log(p.then);
            p.then(function(data) {
                console.log(data);
                done();
            }, console.error, console.log);
            $timeout(function() {
                $scope.$digest();
            }, 100);
            $timeout(function() {
                $scope.$digest();
            }, 600);
            $timeout(function() {
                $scope.$digest();
            }, 1200);
        }, this, {$scope: $scope});
        //done();
    });
    it.skip('a bigger test', function(done) {
        theModule
            .factory('testFactory', function(Timezone, $rootScope) {
                console.log(Timezone);
                var p = Timezone.getZones().$promise; 
                console.log(p.then);
                p.then(function(data) {
                    console.log(data);
                    done();
                });
            });
        console.log(doc);
        console.log(angular.injector().get('testFactory'));
        //var doc = $compile('<html><body ng-app="testApp"></body></html>')($scope);
        //angular.bootstrap(doc, ['aNiceModule']);
        //$scope.$digest();
        //$scope.$digest();
    });
    it.skip('should return an array of timezones', function(done) {
        this.timeout(50000);
        angular.module('aNiceModule', ['lbServices'])
            .run(function(Timezone, $rootScope) {
                console.log(Timezone);
                var p = Timezone.getZones().$promise; 
                console.log(p.then);
                p.then(function(data) {
                    console.log(data);
                    done();
                });
                $rootScope.$digest();
                $rootScope.$digest();
            });
        angular.bootstrap(document, ['aNiceModule']);
        return;
        request.get('/api/timezones/getZones')
            .expect(200, function(err) {
                if (err)
                    console.log(err);
            })
            .expect(function(data) {
                expect(data.body.zoneList).to.exist;
                expect(data.body.zoneList).to.be.array;
            })
            .expect({zoneList: moment.tz.names()})
            .expect(function(data) {
                done();
            });
    });
});