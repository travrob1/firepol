'use strict';

/* globals angular */

angular.module('app')
    .controller('questionList', questionList);

function questionList($scope, Question) {
    $scope.questionList = Question.find();
    $scope.questionList.$promise.catch(function(e){
        console.log('error', e);
    });
    
}