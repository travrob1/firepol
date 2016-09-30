'use strict';

/* globals angular, _ */

angular.module('app')
    .factory('postApi', postApi);

function postApi($http) {
    return {
        create: create,
        findTidbitsByPostId: findTidbitsByPostId,
        getComments: getComments,
        getPostById: getPostById,
        postComment: postComment,
        getPosts: getPosts,
        postTidbit: postTidbitsByPostId

    };
    function create(questionObj) {
        return $http.post('/api/Posts',{
            'title': questionObj.title
            })
        .then(sendTidbit);

        function sendTidbit(res) {
            var theRes = res;
            return $http.post('/api/Posts/'+res.data.id+'/Tidbit',{
                'content': questionObj.details,
                'name': questionObj.username
            }).then(function(tbRes) {
                return _.merge(theRes, tbRes);
            });
        }
    }

    function findTidbitsByPostId(id){
        return $http.get('/api/Posts/'+id + '/Tidbit');
    }

    function postTidbitsByPostId(postId, content, username){
        return $http.post('/api/Posts/'+postId+'/Tidbit',{
            'content': content,
            'name': username
        });
    }

    function getComments(tidbitId){
        return $http.get('/api/Tidbits/' +tidbitId+ '/Comments');
    }

    function postComment(tidbitId, data){
        return $http.post('/api/Tidbits/' +tidbitId+ '/Comments', data);
    }

    function getPosts(){
        return $http.get('/api/Posts/');
    } 
    function getPostById(id){
        return $http.get('/api/Posts/'+ id);
    }
}