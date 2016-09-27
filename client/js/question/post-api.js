'use strict';

/* globals angular, _ */

angular.module('app')
    .factory('postApi', postApi);

function postApi($http) {
    return {
        create: create,
        findTidbitsByPostId: findTidbitsByPostId,
        getComments: getComments,
        getPostById: getPostById

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
            }).then(function(tbRes) {
                return _.merge(theRes, tbRes);
            });
        }
    }

    function findTidbitsByPostId(id){
        return $http.get('/api/Posts/'+id + '/Tidbit');
    }

    function getComments(tidbitId){
        return $http.get('/api/Tidbits/' +tidbitId+ '/Comments');
    }

    function getPostById(id){
        return $http.get('/api/Posts/'+ id);
    }
}