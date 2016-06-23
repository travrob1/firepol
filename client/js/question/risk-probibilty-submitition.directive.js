'use strict';

/* globals angular */

angular.module('app')
    .directive('riskProbibiltySubmitition', riskProbibilty);

function riskProbibilty(){
    return {
        restrict: 'E',
        templateUrl: '/js/question/risk-probabilty-template.html',
        link: function(scope, elem, attrs){
                
        }
    };
}