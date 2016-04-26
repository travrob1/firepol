'use strict';


/*global angular*/
angular.module('app').controller('profileCtrl', function($scope, UserProfile){
    UserProfile.getUserProfileDefinition().$promise
     .then(function(data){
        data.userProfileDefinition.splice(2, 1);
         $scope.userProfileDef = data.userProfileDefinition;
         
     },console.log, 
     console.log);
});
