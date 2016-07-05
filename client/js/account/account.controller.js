'use strict';
/*global angular */
angular.module('app').controller('accountCtrl',function($scope, FirepolUser, $http){
    function populateUserInfo(u) {
        $scope.user.name = u.username;
        $scope.user.email = u.email;
    }

    $scope.user = {};
    $scope.userPasswords = {};
    FirepolUser.findById({id: $scope.$root.authenticatedUser.id}).$promise
    .then(populateUserInfo, console.error);
    
    $scope.updateAccount = function () {
        FirepolUser.prototype$updateAttributes({id: $scope.$root.authenticatedUser.id},
            {username: $scope.user.name,
            email: $scope.user.email
            });
    };

    $scope.updatePassword = function() {
        function updatedPassword(s, e) {
            console.log('updatePassword', s, e);
        }
        $http.put('/api/FirepolUsers/updatePassword', $scope.userPasswords)
            .then(updatedPassword);
    };
});