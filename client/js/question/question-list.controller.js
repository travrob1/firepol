'use strict';

/* globals angular */

angular.module('app')
    .controller('questionList', questionList);

function questionList($scope, postApi) {
   postApi.getPosts()
    .then(function(res){
        $scope.postsList = res.data;
    });
    
}