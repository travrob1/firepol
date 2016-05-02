'use strict';

/*global angular, $ */

angular.module('app').factory('AuthService', function(FirepolUser, $rootScope) {
    function login(email, password) {
      var TWO_WEEKS = 60 * 60 * 24 * 7 * 2;
      return FirepolUser
        .login({ rememberMe: true },{email: email, password: password, ttl: TWO_WEEKS})
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

    function getCurrent(){
      return FirepolUser.getCurrent(
        function(response){
          $rootScope.authenticatedUser = {
            id: response.id,
            email: response.email
          };
        },
        function(error){
          //no logged in user
        }).$promise;
    }

    return {
      login: login,
      logout: logout,
      register: register,
      getCurrent: getCurrent
    };
  });
