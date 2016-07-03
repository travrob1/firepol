/*global angular*/

angular.module('app')
.controller('registerCtrl',function($scope, AuthService, $location, state){
    $scope.register = function(){
        AuthService.register($scope.user.email, $scope.user.password)
            .then(function(res){
                return AuthService.login($scope.user.email, $scope.user.password);
            })
            .then(function(){
                state.ui.firstTimeLoggedIn = true;
                $location.path('/user-profile');
            })
            .catch(function(err){
                var message = err.data.error.message;
                if(message.indexOf('Must provide a valid email') > -1){
                    $scope.registerError = 'Must provide a valid email';
                }
                if(message.indexOf('Email already exists') > -1){
                    $scope.registerError = 'Email already exists';
                }
            });
    };
});