'use strict';
/*global angular */
angular.module('app').directive('checkboxTemplate', function(){
    return {
        restrict:'EA',
        templateUrl: 'js/user-profile/checkbox-template.html',
        link: function(scope, elem, attrs, ctrl){
            scope.field = scope.rowDef;
        }
    };    
});