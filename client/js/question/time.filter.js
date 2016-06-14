'use strict';

/*global angular */

angular.module('app')
    .filter('timeToWords', timeToWords);
/* todo put this in a factory */
function timeToWords() {
    return function(theTimeString) {
        var delta = Date.now() - Date.parse(theTimeString);
        var val;
        if ( delta < 60 * 1000)
            return 'seconds ago';
        else if ( delta < 60 * 60 * 1000) {
            val = trimNumber(delta / (60 * 1000));
            if (val === '1') {
                    return  + val + ' minute ago';
            } else {
                return  + val + ' minutes ago';
            }
        }
        else if ( delta < 24 * 60 * 60 * 1000) {
            val = trimNumber(delta / (60 * 60 * 1000));
            if (val === '1') {
                return val + ' hour ago';
            } else {
                return val + ' hours ago';
            }
        }
        else if ( delta < 30 * 24 * 60 * 60 * 1000) {
            val = trimNumber(delta / (24 * 60 * 60 * 1000));
            if (val === '1') {
                return val + ' day ago';
            } else {
                return val + ' days ago';
            }
        }
        else if ( delta < 12 * 30 * 24 * 60 * 60 * 1000) {
            val = trimNumber(delta / (30 * 24 * 60 * 60 * 1000));
            if (val === '1') {
                return val + ' month ago';
            } else {
                return val + ' months ago';
            }
        }
        else {
            val = trimNumber(delta / (12 * 30 * 24 * 60 * 60 * 1000));
            if (val === '1') {
                return val + ' year ago';
            } else {
                return val + ' years ago';
            }
        }
    };

    function trimNumber(num, post) {
            function err(msg) {
                throw msg;
            }
            if ( ! (num || num === 0.0) ) {
                err('trimNumber() requires one input parameter');
            }
            if (!post){
                post = 0;
            }
            
            var ret = '' + num;
            var decimalPos = ret.indexOf('.');
            if ( decimalPos > -1 ) {
                if ( post === 0 ) 
                    ret = ret.substr(0, decimalPos + post);
                else
                    ret = ret.substr(0, decimalPos + post + 1);
            }
            return ret;
        } 
}