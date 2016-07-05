'use strict';

var Dconsole = {
    error: function (x) {
        console.error(JSON.stringify(x, null, 2));
    },
    log: function (x) {
        console.log(JSON.stringify(x, null, 2));
    }
};


/*global angular, _ */
angular.module('app').controller('profileCtrl', function($scope, $filter, $q, $state, configuration, UserProfile, FirepolUser, state){
    $scope.capitalize = $filter('capitalize');
    $scope.userProfile = {}; //UserProfile.create({userId: '1', sex: 'male'});

    UserProfile.getUserProfileDefinition().$promise
     .then(function(data){

        var currCat, categoryList = [], rowDefList;
        _.forEach(data.userProfileDefinition, function(def) {

            if (currCat !== def.category) {
                currCat = def.category;
                rowDefList = {category: def.category, rowDefList: []};
                categoryList.push(rowDefList);
            }
            rowDefList.rowDefList.push(def);
        });
        $scope.categoryList = categoryList;
         
     },console.log, 
     console.log);

    function findOrCreateProfile(p) {
        if (p.length) {
            $scope.userProfile = p[0];
        } else {
            FirepolUser.UserProfile.create(
                {id: $scope.$root.authenticatedUser.id},
                $scope.userProfile).$promise
                .then(createdProfile);
        }
     }
     function createdProfile(p) {
         $scope.userProfile = p;
     }
     FirepolUser.UserProfile({id: $scope.$root.authenticatedUser.id}).$promise
        .then(findOrCreateProfile);

     $scope.update = function() {
        FirepolUser.UserProfile.updateById({
            id: $scope.$root.authenticatedUser.id, 
            fk: $scope.userProfile.id
        }, $scope.userProfile);
        if (state.ui.firstTimeLoggedIn){
            $state.transitionTo('questions');
        }
     };
});
