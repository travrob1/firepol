'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, $timeout, postApi, state) {
    $scope.activeComment = {
        id: false,
        text: ''
    };
    var postId = $stateParams.id;

    if(state.ui.postTitle){
        $scope.postTitle = state.ui.postTitle;
    }else {
        postApi.getPostById(postId)
            .then(function(res){
                $scope.postTitle = res.data.title;
            });
    }
    postApi.findTidbitsByPostId(postId)
        .then(function(res){
            _.forEach(res.data, buildTidbit);
    });
    
    $scope.tidbits = [];
    function buildTidbit(tidbit) {
        debugger
        $scope.tidbits.push(tidbit);
        var comments;
        postApi.getComments(tidbit.id)
        .then(function(res){
            comments = res.data;
            $scope.comments = sortComments();
        });

       
        
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
    }

    function saveStateToSession(){
        state.ui.comeBackUrl = '/question/' + postId;
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
            saveStateToSession();
        } else if (! $scope.question ) {
            window.alert('something went wrong, please referesh (missing question?)');
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

   
}