/*global angular*/

angular.module('app')
.controller('marketingCtrl',function($scope, Question){
    $scope.questionList = Question.find({
        filter: { limit: 6, order: 'modified DESC', }
    });
});