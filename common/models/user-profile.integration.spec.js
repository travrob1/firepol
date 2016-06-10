'use strict';

/* globals describe, it, chai, angular, beforeEach, inject, afterEach, $rootScope, $injector, testIdentifier, apiErrorHandler, _, Dconsole */
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
    
    var userId1, userId2;

    function loginFirepolUser() {
        console.log('logging in firepol user')
        return FirepolUser
            .login({ rememberMe: true },
                {email: 'userProfileTest@foo.com', password: 'aTestPassword', ttl: 1000 })
            .$promise;
    }

    function logout() {
        console.log('logging out')
        return FirepolUser
            .logout()
            .$promise;
    }

    it('can create a FirepolUser', function(done) {
        $injector.invoke(function($timeout) {
            var c = FirepolUser.create({
                'username': 'userProfileTest',
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'userProfileTest@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26'
                });
            c.$promise.then(function(data) {
                userId1 = data.id;
                done();
            }, apiErrorHandler, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });

    it('cannot create a User with duplicate username', function(done) {
        $injector.invoke(function($timeout) {
            var c = FirepolUser.create({
                'realm': 'string',
                'username': 'userProfileTest',
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'userProfileTestNotDupe@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26'
                });
            c.$promise.then(apiErrorHandler, function(data) {
                userId2 = data.id;
                done();
            }, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });

    it('cannot create a User with duplicate email', function(done) {
        $injector.invoke(function($timeout) {
            var c = FirepolUser.create({
                'realm': 'string',
                'username': 'userb' + testIdentifier,
                'password': 'aTestPassword',
                'credentials': {},
                'challenges': {},
                'email': 'userProfileTest@foo.com',
                'emailVerified': true,
                'status': 'string',
                'created': '2016-04-26',
                'lastUpdated': '2016-04-26'
                });
            c.$promise.then(apiErrorHandler, function(data) {
                done();
            }, console.log);
        }, this, {$scope: $scope});
        $scope.$digest();
    });
    it('can find an User by id', function(done) {
        $injector.invoke(function($timeout) {
            loginFirepolUser()
                .then(findUser)
                .then(function(data) {
                    done();
                }, apiErrorHandler, console.log);
            function findUser() {
                return FirepolUser.findById( {id: userId1}).$promise;
            }
        }, this, {$scope: $scope});
    });

    describe('UserProfile', function() {
        var $scope,
            UserProfile = $injector.get('UserProfile'),
            $q = $injector.get('$q');
    
        beforeEach(function() {
            $scope = $rootScope.$new(true);
        });
        afterEach(function() {
            $scope.$destroy();
        });
        
        function getUserProfileDef() {
            console.log('getUserProfileDef')
            return UserProfile.getUserProfileDefinition().$promise;
        }
        it('cannot get the UI definition without login', function(done) {
            $injector.invoke(function($timeout) {
                logout()
                    .then(getUserProfileDef)
                    .then(function(data) {
                        expect(true).to.be.false;
                        done();
                    })
                    .catch(function(e) {
                        expect(true).to.be.true;
                        done();
                    });
            }, this, {$scope: $scope});
        });
        it('can get the UI definition', function(done) {
            $injector.invoke(function($timeout) {
                loginFirepolUser()
                    .then(getUserProfileDef)
                    .then(function(data) {
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

        var userProfileId1;
        it('can create a UserProfile with all nulls, except the userId', function(done) {
            $injector.invoke(function($timeout) {
                function createUserProfile() {
                    return FirepolUser.UserProfile.create(
                        {id: userId1},
                        {'test': 'foo'})
                        .$promise.then(function(up) {
                            Dconsole.log('up', up);
                            userProfileId1 = up.id;
                        });
                }
                $q.resolve(true)
                    .then(loginFirepolUser)
                    .then(createUserProfile)
                    .then(function(data) {
                        expect(true).to.be.true;
                        done();
                    })
                    .catch(function(e) {
                        Dconsole.log(e);
                        expect(true).to.be.false;
                    });
            }, this, {$scope: $scope});
            $scope.$digest();
        });
        it('can find an UserProfile by id', function(done) {
            $injector.invoke(function($timeout) {
                $q.resolve(true)
                    .then(loginFirepolUser)
                    .then(findUserProfile)
                    .then(function(up) {
                        done();
                    })
                    .catch(function(e) {
                        Dconsole.log(e);
                        expect(false).to.be.true;
                        done();
                    });
                function findUserProfile() {
                    return FirepolUser.UserProfile.findById({id: userId1, fk: userProfileId1}).$promise;
                } 
            }, this, {$scope: $scope});
        });
        it('can find an UserProfile with just the userid', function(done) {
            $injector.invoke(function($timeout) {
                $q.resolve(true)
                    .then(loginFirepolUser)
                    .then(findUserProfile)
                    .then(function(up) {
                        done();
                    })
                    .catch(function(e) {
                        Dconsole.log(e);
                        expect(false).to.be.true;
                        done();
                    });
                function findUserProfile() {
                    return FirepolUser.UserProfile({id: userId1}).$promise;
                }
            }, this, {$scope: $scope});
        });
        it('will logout', function() {
            logout();
            expect(true).to.be.true;
        });
    });
});
