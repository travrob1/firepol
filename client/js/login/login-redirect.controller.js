'use strict';
//NOTE: This controller is only ever use for social logins.  Local longins are managed inside the register.controller.js

/*global angular, _ */
angular.module('app')
    .controller('loginRedirectCtrl',function($rootScope, $scope, $state, $location, configuration, FirepolUser, state){
    if (configuration.bootstrapLogin){
        $scope.$on('UserSetToScope',function () {
            if (_.get($rootScope, 'authenticatedUser.profiles[0].created') === _.get($rootScope, 'authenticatedUser.profiles[0].modified')) {
                state.ui.firstTimeLoggedIn = true;
                $state.transitionTo('setUsername');
            } else if (state.ui.comeBackUrl){
                $location.path(state.ui.comeBackUrl);
            }
            else {
                $state.transitionTo('questions');
            }
        });


    }
});