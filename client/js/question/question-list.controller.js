'use strict';

/* globals angular */

angular.module('app')
    .controller('questionList', questionList);

function questionList($scope, Question) {
    $scope.questionList = Question.find();
    $scope.questionList.$promise.then(function(x) { console.log('here', x); });
    
}