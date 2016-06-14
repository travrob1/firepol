'use strict';

/* globals angular */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, Question) {
   $q
     .all([
        Question.findById({ id: $stateParams.id }).$promise,
        Question.Comments({ id: $stateParams.id }).$promise
     ])
     .then(function(data) {
        $scope.question = data[0];
        $scope.comments = data[1];
     });
    
}