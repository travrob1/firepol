'use strict';

/*global angular */
angular.module('app').controller('loginRedirectCtrl',function($state, $q, configuration, FirepolUser){

    function saveUser() {
        return FirepolUser.prototype$updateAttributes(
            { id: configuration.user.id }, 
            { 
                email:  configuration.user.profiles[0].profile._json.email,
                locale: configuration.user.profiles[0].profile._json.locale,
                timezone: configuration.user.profiles[0].profile._json.timezone,
                facebookLink: configuration.user.profiles[0].profile._json.link,
                name: configuration.user.profiles[0].profile._json.first_name + ' ' + configuration.user.profiles[0].profile._json.last_name,
                verified: configuration.user.profiles[0].profile._json.verified
            }
        ).$promise;
    }
    function saveProfile(u) {
        return FirepolUser.UserProfile.create(
            { id: u.id }, 
            { 
                name: configuration.user.profiles[0].profile._json.first_name + ' ' + configuration.user.profiles[0].profile._json.last_name,
                sex: configuration.user.profiles[0].profile._json.gender
            }
        ).$promise;
    }
    if (configuration.user.profiles[0].created === configuration.user.profiles[0].modified){
        $q.resolve(true)
        .then(saveUser)
        .then(saveProfile);

        // TODO: ask for username to continue 
        $state.transitionTo('user-profile');
    }else {
        $state.transitionTo('questions');
    }
}); 