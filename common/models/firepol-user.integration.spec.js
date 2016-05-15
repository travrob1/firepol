'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach,
    $rootScope, $injector, testIdentifier, Dconsole */
/*
var expect = require('chai').expect,
    moment = require('moment-timezone'),
    request = require('supertest')('http://localhost:3000');
*/
var expect = chai.expect;

describe('FirepolUser', function() {
    var $scope, FirepolUser = $injector.get('FirepolUser');

    beforeEach(function() {
        $scope = $rootScope.$new(true);
    });
    afterEach(function() {
        $scope.$destroy();
    });
    
    it('can create a FirepolUser', function(done) {
        $injector.invoke(function($timeout) {
            var c = FirepolUser.create({
                'name': 'A. ' + testIdentifier,
                'username': 'zaggmore-' + testIdentifier,
                'password': 'zigless',
                'email': 'firepol-itest-' + testIdentifier +'@sky.chrisdavid.com',
                'id': 'test-FirepolUser-' + testIdentifier
                });
            c.$promise.then(function(data) {
                done();
            }, Dconsole.error, console.log);
        }, this, {$scope: $scope});
    });
    it('can find a FirepolUser by id', function(done) {
        $injector.invoke(function($timeout) {
            var email = 'firepol-itest-' + testIdentifier +'@sky.chrisdavid.com';
            function findUser(x) {
                FirepolUser.findById( {id: 'test-FirepolUser-' + testIdentifier})
                    .$promise
                    .then(function(data) {
                        expect(data.name).to.equal('A. ' + testIdentifier);
                        done();
                }, Dconsole.error, console.log);
            }
            FirepolUser
                .login({ rememberMe: $scope.rememberMe },{email: email, password: 'zigless', ttl: 1000 })
                .$promise
                .then(findUser);
        }, this, {$scope: $scope});
    });
    it('can find an FirepolUser by id return via auth', function(done) {
        $injector.invoke(function($timeout) {
            var email = 'firepol-itest-' + testIdentifier +'@sky.chrisdavid.com';
            function findUser(x) {
                FirepolUser.findById( {id: x.userId})
                    .$promise
                    .then(function(data) {
                        expect(data.name).to.equal('A. ' + testIdentifier);
                        done();
                }, Dconsole.error, console.log);
            }
            FirepolUser
                .login({ rememberMe: $scope.rememberMe },{email: email, password: 'zigless', ttl: 1000 })
                .$promise
                .then(findUser);
        }, this, {$scope: $scope});
    });
});