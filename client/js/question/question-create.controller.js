'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionCreateCtrl', questionCreate);

function questionCreate($scope, $q, $stateParams, $timeout, $location, $http, postApi, state) {
    $scope.createQuestion = function(){
        postApi.create(_.merge({}, $scope.question, $scope.$root.authenticatedUser))
        .then(function(res){
            state.ui.postTitle = res.data.title;
            $location.path('question/' + _.get(res, 'data.postId'));
        }).catch(function(e){
            console.log('error happend on create question', e);
        });
    };
}