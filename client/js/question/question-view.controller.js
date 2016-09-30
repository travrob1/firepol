'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, $timeout, postApi, state) {
    $scope.activeComment = {
        id: undefined,
        text: ''
    };
    var postId = $stateParams.id;
    var authUser = $scope.$root.authenticatedUser;

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
        $scope.tidbits.push(tidbit);
        getComments(tidbit);
    }
    function getComments(tidbit){
        postApi.getComments(tidbit.id)
        .then(function(res){
            if ( ! $scope.commentsByTidbit) {
                $scope.commentsByTidbit = {};
            }
            var comments = res.data;
            $scope.commentsByTidbit[tidbit.id] = sortComments(comments);
            console.log($scope.commentsByTidbit);
        });
    }
    function sortComments(theComments) {
        var comments = _.sortBy(theComments, function(a) {
            return a.time;
        });
        var rootComments = _.filter(comments, function(c) {
            return !c.inReferenceToCommentId;
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
                    return cr.id === c.inReferenceToCommentId;
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

    $scope.postComment = function(tidbit, commentId) {
        if(!authUser){
            saveStateToSession();
        }else {
            postApi.postComment(tidbit.id, {
                'text': $scope.activeComment.text,
                'inReferenceToCommentId': commentId,
                'name': authUser.username
            }).then(function(res) {
                $scope.activeComment = {
                    id: undefined,
                    text: ''
                };
                getComments(tidbit);
            });
        }
    };

    $scope.postTidbit = function(){
        if(!authUser){
            saveStateToSession();
        }else {
            postApi.postTidbit(postId, $scope.newTidbit, authUser.username)
                .then(function(res) {
                    
                $scope.tidbits.push(res.data);
                $scope.newTidbit = '';
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