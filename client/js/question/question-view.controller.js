'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, $timeout, Question) {

    var questionId = $stateParams.id;
    $q
        .all([
            Question.findById({
                id: questionId
            }).$promise,
            Question.Comments({
                id: questionId
            }).$promise,
            Question.Answers({
                id: questionId
            }).$promise,
        ])
        .then(displayComments);

    function displayComments(data) {
        $scope.activeComment = {
            id: false,
            text: ''
        };
        $scope.question = data[0];
        var comments = data[1];
        var answers = data[2];
        $scope.answers = answers;

        function sortComments() {
            comments = _.sortBy(comments, function(a) {
                return a.time;
            });
            var rootComments = _.filter(comments, function(c) {
                return !c.inReferenceTo;
            });
            _.forEach(rootComments, function(c) {
                c.indent = 0;
                c.childCount = 0;
            });
            var otherComments = _.differenceBy(comments, rootComments, function(c) {
                return c.id;
            });
            _.forEach(otherComments, function(c) {
                var parentIndex = _.findIndex(rootComments, function(cr) {
                        return cr.id === c.inReferenceTo;
                    }),
                    parent = rootComments[parentIndex];
                c.indent = parent.indent + 33;
                rootComments.splice(parentIndex + 1 + parent.childCount, 0, c);
                for (var p = parent; p; p = p.parent) {
                    p.childCount += 1;
                }
                c.childCount = 0;
                c.parent = parent;
            });
            return rootComments;
        }

        $scope.comments = sortComments();
        
        if (answers[0]) {
            $scope.certainty = _.find($scope.certaintyList, {
                val: answers[0].decisionCertainty
            });
            $scope.odds = _.find($scope.oddsList, {
                val: answers[0].liklihood
            });

        }
    }

    $scope.makeReply = function(commentId) {
        Question.Comments.create({
            'id': $scope.question.id
        }, {
            'text': $scope.activeComment.text,
            'inReferenceTo': commentId
        }).$promise.then(function(res) {
            $q
                .all([
                    $scope.question,
                    Question.Comments({
                        id: $stateParams.id
                    }).$promise,
                    $scope.answers
                ])
                .then(displayComments);
        });
    };

    $scope.replyToComment = function(commentId, e) {
        $scope.activeComment.id = commentId;
        $timeout(function() {
            e.target.parentNode.parentNode.getElementsByClassName('selectedCommentInput')[0].focus();
        }, 100);
    };
    $scope.submitAnswer = function() {
        Question.Answers.create({
            'id': $scope.question.id
        }, {
            'liklihood': $scope.odds.val,
            'decisionCertainty': $scope.certainty.val
        });
    };


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