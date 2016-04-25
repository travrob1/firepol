'use strict';


/*global angular*/
angular.module('app').controller('profileCtrl', function($scope, UserProfile){
    UserProfile.getUserProfileDefinition().$promise
     .then(function(data){
         $scope.userProfileDef = data.userProfileDefinition;
         
     },console.log, 
     console.log);
});
