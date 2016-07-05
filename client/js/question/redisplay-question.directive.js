'use strict';

/* globals angular, $ , window*/

angular.module('app')
    .directive('redisplayQuestion', reShowquestion);

function reShowquestion($window){
    return {
        restrict: 'E',
        template: '<div ng-if="reShow === true"><h1>{{question.question}}</h1><p>{{question.details}}</p></div>',
        link: function(scope, elem, attrs){
            scope.reShow = false;
            
            var scrollTop;
            var questionWrapper = $('#question-wrapper');

            $window.onscroll = function() {
                if (questionWrapper.length === 0){
                    return;
                }

                var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

                var topOfQuestion =  questionWrapper.offset().top;
                var questionContentHeight = questionWrapper.outerHeight();
                var navbarHeight = $('.navbar').outerHeight();


                if(scrollTop >= topOfQuestion + questionContentHeight - navbarHeight){
                        scope.reShow = true;
                        scope.$digest();
                } else {
                        scope.reShow = false;
                        scope.$digest();

                }
        
            };


        }
    };
}