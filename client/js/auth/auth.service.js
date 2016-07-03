'use strict';

/*global angular, $, _ */

angular.module('app').factory('AuthService', function(FirepolUser, $rootScope, configuration, $http, $q, $location) {
    function race(promises) {
      var deferred = $q.defer();

      _.forEach(promises, function(promise) {
        $q.when(promise).then(deferred.resolve);
      });

      return deferred.promise;
    }


    function login(email, password) {
        var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;
        return FirepolUser
            .login({
                rememberMe: true
            }, {
                email: email,
                password: password,
                ttl: TWO_WEEKS
            })
            .$promise
            .then(function(response) {
                $rootScope.authenticatedUser = {
                    id: response.user.id,
                    tokenId: response.id,
                    email: email
                };
                $('#loginForm').modal('hide');
            });
    }

    function logout() {
        function socialLogout() {
            return $http.get('/auth/logout');
        }
        function loopbackLogout() {
            return FirepolUser
                .logout()
                .$promise
        }
        return race([socialLogout(), loopbackLogout()])
        .then(function() {
            debugger
                $rootScope.authenticatedUser = undefined;
                $location.path('/');
            });
    }

    function register(email, password) {
        return FirepolUser
            .create({
                email: email,
                password: password
            })
            .$promise;
    }

    function getCurrent() {
        debugger
        if (configuration.bootstrapLogin) {
            return $http.get('auth/getCurrent')
            .then(function (res) {
                $rootScope.authenticatedUser = res.data.user;
            })
        } else {
            return FirepolUser.getCurrent(
                function(response) {
                    console.log('res', response);
                    $rootScope.authenticatedUser = {
                        id: response.id,
                        email: response.email,
                        username: response.username
                    };
                },
                function(error) {
                    console.log('no logged in user')
                }).$promise;
        }
    }

    return {
        login: login,
        logout: logout,
        register: register,
        getCurrent: getCurrent
    };
});