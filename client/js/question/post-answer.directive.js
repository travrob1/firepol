'use strict';

/* globals angular */

angular.module('app')
    .directive('postAnswer', postAnswer);

function postAnswer(){
    return {
        restrict: 'E',
        templateUrl: '/js/question/post-answer-template.html',
        link: function(scope, elem, attrs){
                
        }
    };
}