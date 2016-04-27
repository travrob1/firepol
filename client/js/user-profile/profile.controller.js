'use strict';


/*global angular, _ */
angular.module('app').controller('profileCtrl', function($scope, UserProfile, $filter){
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
});
