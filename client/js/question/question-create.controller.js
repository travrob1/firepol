'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionCreateCtrl', questionCreate);

function questionCreate($scope, $q, $stateParams, $timeout, $location, $http, questionApi) {
    $scope.createQuestion = function(){
        questionApi.create($scope.question)
        .then(function(res){
            $location.path('question/' + _.get(res, 'data.id'));
        }).catch(function(e){
            console.log('error happend on create question', e);
        });
    };
}