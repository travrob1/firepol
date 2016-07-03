'use strict';
//NOTE: This controller is only ever use for social logins.  Local longins are managed inside the register.controller.js

/*global angular, _ */
angular.module('app').controller('loginRedirectCtrl',function($state, $q, configuration, FirepolUser, state){

    if (configuration.user.profiles[0].created === configuration.user.profiles[0].modified){
        state.ui.firstTimeLoggedIn = true;


        // TODO: ticket - prompt social logins user for username on next page
        $state.transitionTo('user-profile');
    }else {
        $state.transitionTo('questions');
    }
}); 