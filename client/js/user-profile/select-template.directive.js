'use strict';
/*global angular */
angular.module('app').directive('selectTemplate', function(){
    return {
        restrict:'EA',
        templateUrl: 'js/user-profile/select-template.html',
        link: function(scope, elem, attrs, ctrl){
            scope.field = scope.rowDef;
        }
    };    
});