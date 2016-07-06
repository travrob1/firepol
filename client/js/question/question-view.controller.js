'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, $timeout, Question, state) {
    $scope.activeComment = {
        id: false,
        text: ''
    };
    var questionId = $stateParams.id;
    function checkStateForUnsavedOrGetAnswer() {
        if(state.ui.comeBackUrl){
            _.merge($scope, state.ui.returnToQuestionScope);
            delete state.ui.returnToQuestionScope;
            delete state.ui.comeBackUrl;
            if (state.ui.wasSubmittingAnswer) {
                return $scope.submitAnswer().then(getSavedAnswer);
            } else {
                return getSavedAnswer();
            }
            delete state.ui.wasSubmittingAnswer;
        } else {
            return getSavedAnswer();
        }

        function getSavedAnswer() {
            if($scope.$root.authenticatedUser){
                return Question.Answers({
                    id: questionId
                }).$promise
            } else {
                return [];
            }
        }
    }
        
    function displayComments(data) {

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

    function setSessionStorage(){
        state.ui.comeBackUrl = '/question/' + questionId;
        state.ui.returnToQuestionScope = {
            activeComment: $scope.activeComment,
            odds: $scope.odds,
            certainty: $scope.certainty
        };
        var stringifiedData = JSON.stringify(state.ui);

        window.sessionStorage.setItem('state.ui', stringifiedData);
        $('.modal').modal('show');

    }

    $scope.makeReply = function(commentId) {
        if(!$scope.$root.authenticatedUser){
            setSessionStorage()

           
        }else {
            Question.Comments.create({
                'id': $scope.question.id
            }, {
                'text': $scope.activeComment.text,
                'inReferenceTo': commentId
            }).$promise.then(function(res) {
                $scope.activeComment = {
                    id: false,
                    text: ''
                };
                $q.all([
                        $scope.question,
                        Question.Comments({
                            id: $stateParams.id
                        }).$promise,
                        $scope.answers
                    ])
                    .then(displayComments);
            });
        }
    };

    $scope.replyToComment = function(commentId, e) {
        $scope.activeComment.id = commentId;
        $timeout(function() {
            e.target.parentNode.parentNode.getElementsByClassName('selectedCommentInput')[0].focus();
        }, 100);
    };

    $scope.submitAnswer = function() {

        if(!$scope.$root.authenticatedUser){
            state.ui.wasSubmittingAnswer = true;
            setSessionStorage()
        } else {

            return Question.Answers.create({
                'id': questionId
            }, {
                'liklihood': $scope.odds,
                'decisionCertainty': $scope.certainty
            }).$promise;
        }
        
    };

    $q.all([
            Question.findById({
                id: questionId
            }).$promise,
            Question.Comments({
                id: questionId
            }).$promise,
            checkStateForUnsavedOrGetAnswer()
        ])
        .then(displayComments);

}