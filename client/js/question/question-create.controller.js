'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionCreateCtrl', questionCreate);

function questionCreate($scope, $q, $stateParams, $timeout, $location, Question) {

    var certaintyOptions = [50, 70, 90, 100],
        oddsOptions = [1, 2, 5, 10, 100, 1000, 10000, 100000, 1000000, 1000000000],
        certIndx = 0,
        oddIndx = 0;
        var counter = 0;
    var intervalTimerCancel = setInterval(function(){ 
        $scope.certainty = certaintyOptions[certIndx];
        $scope.odds = oddsOptions[oddIndx];

        certIndx++;
        certIndx %= certaintyOptions.length;

        oddIndx++;
        oddIndx %= oddsOptions.length;
        $scope.$digest();
    }, 2000);


    $scope.$on('$destroy', function(){
        clearInterval(intervalTimerCancel);
    });

    $scope.createQuestion = function(){
        Question.create({
            question: $scope.question.question, 
            details: $scope.question.details
        }).$promise.then(function(res){
            $location.path('question/' + res.id)
        }).catch(function(e){
            console.log('error happend on create question', e);
        });
    };

}