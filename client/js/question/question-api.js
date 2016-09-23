'use strict';

/* globals angular, _ */

angular.module('app')
    .factory('questionApi', questionApi);

function questionApi($http) {
    return {
        create: create
    };
    function create(questionObj) {
        return $http.post('/api/Posts',{
            'title': questionObj.title
            })
        .then(sendTidbit);

        function sendTidbit(res) {
            var theRes = res;
            return $http.post('/api/Tidbits',{
            'content': questionObj.details,
            'postId': _.get(res, 'data.id')
            }).then(function() {
                return theRes;
            });
        }
    }
}