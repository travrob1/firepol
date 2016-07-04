'use strict';
//NOTE: This controller is only ever use for social logins.  Local longins are managed inside the register.controller.js

/*global angular, _ */
angular.module('app')
    .controller('loginRedirectCtrl',function($rootScope, $scope, $state, configuration, FirepolUser, state){
    if (configuration.bootstrapLogin){
        $scope.$on('UserSetToScope',function () {
            if (_.get($rootScope, 'authenticatedUser.profiles[0].created') === _.get($rootScope, 'authenticatedUser.profiles[0].modified')) {
                // TODO: ticket - prompt social logins user for username on next page
                state.ui.firstTimeLoggedIn = true;
                $state.transitionTo('setUsername');
            } else {
                $state.transitionTo('questions');
            }
        })


    }
});