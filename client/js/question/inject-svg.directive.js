'use strict';
/*global angular, document */

angular.module('app')
.directive('onFinishInjectSvgs', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    var mySVGsToInject = document.querySelectorAll('img.inject-me');

                     // Do the injection
                     SVGInjector(mySVGsToInject);
                });
            }
        }
    };
});