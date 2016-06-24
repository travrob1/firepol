'use strict';

/* globals angular */

angular.module('app')
    .directive('riskProbibiltySubmitition', riskProbibilty);

function riskProbibilty(){
    return {
        restrict: 'E',
        templateUrl: '/js/question/risk-probabilty-template.html',
        link: function(scope, elem, attrs){
        var $scope = scope;
        $scope.odds = '';
        $scope.oddsDescription = '';

        $scope.$watch('odds', function(newValue, oldValue) {
            $scope.oddsDescription = newValue['description'];
        });

        /* certainty of odds */
        // TODO: ASK ABOUT VAL
        $scope.certaintyList = [{
            'val': '50 %',
            'description': 'on the fence.'
        }, {
            'val': 70,
            'description': 'more certain than not.'
        }, {
            'val': 90,
            'description': 'quite certain.'
        }, {
            'val': 100,
            'description': 'absolutely certain.'
        }, ];

        $scope.certainty = '';
        $scope.certaintyDescription = '';

        $scope.$watch('certainty', function(newValue, oldValue) {
            $scope.certaintyDescription = newValue['description'];
            if (newValue) {
                $scope.certaintyDescription = newValue['description'];
            } else {
                $scope.certaintyDescription = ' ';
            }
        });

        /* odds */
        //http://askville.amazon.com/probability-hit-lighting-versus-car-accident/AnswerViewer.do?requestId=99435
        $scope.oddsList = [{
            'val': 1,
            'description': '1 in 1 means it will happen for sure.'
        }, {
            'val': 2,
            'description': '1 in 2 is the toss of a coin.'
        }, {
            'val': 5,
            'description': '1 in 5 are the odds of becoming fat.'
        }, {
            'val': 10,
            'description': '1 in 10 are the odds of eating at McDonalds on any given day.'
        }, {
            'val': 100,
            'description': '1 on 100 are the odds of dying in an auto accident.'
        }, {
            'val': 1000,
            'description': '1 in 1,000 is the odds of dying this year in a motorcycle accident.'
        }, {
            'val': 10000,
            'description': '1 in 10,000 is the odds of being struck dead by lightning.'
        }, {
            'val': 100000,
            'description': '1 in 100,000 are the odds of dying while bicycling.'
        }, {
            'val': 1000000,
            'description': '1 in a million are the odds of dying while falling out of bed or chair.'
        }, {
            'val': 1000000000,
            'description': '1 in a billion are the odds of being struck and killed by a falling aircraft.'
        }, ];
        }
    };
}