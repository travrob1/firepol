'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, $timeout, Question) {

    var questionId = $stateParams.id;
    function getAnswer() {
        if($scope.$root.authenticatedUser){
            return Question.Answers({
                id: questionId
            }).$promise
        } else {
            return [];
        }
    }
    $q
        .all([
            Question.findById({
                id: questionId
            }).$promise,
            Question.Comments({
                id: questionId
            }).$promise,
            getAnswer()
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
            $scope.certainty = answers[0].decisionCertainty;
            $scope.odds = answers[0].liklihood;

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
            'liklihood': $scope.odds,
            'decisionCertainty': $scope.certainty
        });
    };

}