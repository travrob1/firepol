'use strict';
/*global angular */
angular.module('app').directive('radioTemplate', function(){
    return {
        restrict:'E',
        templateUrl: 'js/user-profile/radio-template.html',
        link: function(scope, elem, attrs, ctrl){
            scope.field = scope.rowDef;
        }
    };    
});