'use strict';

/* globals angular, _ */

angular.module('app')
    .controller('questionViewCtrl', questionView);

function questionView($scope, $q, $stateParams, Question) {

    $q
     .all([
        Question.findById({ id: $stateParams.id }).$promise,
        Question.Comments({ id: $stateParams.id }).$promise
     ])
     .then(displayComments);

     function displayComments(data) {
        $scope.activeComment = {
            id: false,
            text: ''
        };
          $scope.question = data[0];
          var comments = data[1];
          function sortComments() {
              comments =  _.sortBy(comments, function(a) { return a.time; });
              var rootComments = _.filter(comments, function(c) { return !c.inReferenceTo; });
              _.forEach(rootComments, function(c) {
                  c.indent = 0;
                  c.childCount = 0;
              });
              var otherComments = _.differenceBy(comments, rootComments, function(c) { return c.id;});
              _.forEach(otherComments, function(c) {
                  var parentIndex = _.findIndex(rootComments, function(cr) { return cr.id === c.inReferenceTo; }),
                      parent = rootComments[parentIndex];
                  c.indent = parent.indent + 33;
                  rootComments.splice(parentIndex + 1 + parent.childCount, 0, c);
                  for(var p = parent; p; p = p.parent) {
                     p.childCount += 1;
                  }
                  c.childCount = 0;
                  c.parent = parent;
              });
              return rootComments;
          }
          $scope.comments = sortComments();
      }

     $scope.makeReply = function(commentId){
        Question.Comments.create({
            'id': $scope.question.id}, {
            'text': $scope.activeComment.text,
            'inReferenceTo': commentId
        }).$promise.then(function(res){
            $q
             .all([
                $scope.question,
                Question.Comments({ id: $stateParams.id }).$promise
             ])
             .then(displayComments);
        });
     };
}
