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
     .then(function(data) {
         $scope.question = data[0];
         var comments = data[1];
         function sortComments() {
              comments.sort(function(a, b) { return a.time > b.time; });
             var rootComments = _.filter(comments, function(c) { return !c.inReferenceTo; });
             _.forEach(rootComments, function(c) {
                 c.indent = 0;
             });
             var otherComments = _.differenceBy(comments, rootComments, function(c) { return c.id;});
             _.forEach(otherComments, function(c) {
                 var parentIndex = _.findIndex(rootComments, function(cr) { return cr.id === c.inReferenceTo; }),
                     parent = rootComments[parentIndex];
                 c.indent = parent.indent + 33;
                 rootComments.splice(parentIndex + 1, 0, c);
             });
             return rootComments;
         }
         $scope.comments = sortComments();
     });
}
