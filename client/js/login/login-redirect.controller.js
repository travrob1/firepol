'use strict';

/*global angular */
angular.module('app').controller('loginRedirectCtrl',function($state, configuration){

    if (configuration.user.profiles[0].created === configuration.user.profiles[0].modified){
        $state.transitionTo('user-profile');
    }else {
        $state.transitionTo('questions');
    }
}); 