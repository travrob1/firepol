/*global angular*/

angular.module('app')
.controller('registerCtrl',function($scope, $state,  AuthService, $location, state, FirepolUser){
    $scope.register = function(){
        AuthService.register($scope.user.email, $scope.user.password, $scope.user.username)
            .then(function(res){
                return AuthService.login($scope.user.email.toLowerCase(), $scope.user.password);
            })
            .then(function(){
                if(state.ui.comeBackUrl){
                    $location.path(state.ui.comeBackUrl);
                }else {
                    state.ui.firstTimeLoggedIn = true;
                    $location.path('/user-profile');
                }
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

    $scope.addUserName = function () {
        return FirepolUser.prototype$updateAttributes(
            { id: $scope.$root.authenticatedUser.id }, {username: $scope.update.username}
        ).$promise
        .then(function () {
            if(state.ui.comeBackUrl){
                $location.path(state.ui.comeBackUrl);
            } else {
                $state.transitionTo('user-profile');
            }
        });
    };
});