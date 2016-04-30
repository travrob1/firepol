'use strict';

/*global angular, $ */

angular.module('app').factory('AuthService', function(FirepolUser, $rootScope) {
    function login(email, password) {
      return FirepolUser
        .login({email: email, password: password})
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
      return FirepolUser
       .logout()
       .$promise
       .then(function() {
         $rootScope.authenticatedUser = null;
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

    return {
      login: login,
      logout: logout,
      register: register
    };
  });
