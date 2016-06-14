'use strict';

/* globals angular */

angular.module('app')
    .directive('questionComments', questionComments);

function questionComments(){
    return {
        restrict: 'E',
        templateUrl: '/js/question/comments-template.html',
        link: function(scope, elem, attrs){
                
        }
    };
}