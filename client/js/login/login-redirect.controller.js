'use strict';

/*global angular, _ */
angular.module('app').controller('loginRedirectCtrl',function($state, $q, configuration, FirepolUser){

    function saveUser() {
        var dataObj;
        if(_.get(configuration, 'user.profiles[0].provider') === 'facebook'){
            dataObj = {
                provider: 'facebook',
                email :_.get(configuration, 'user.profiles[0].profile._json.email'),
                locale : _.get(configuration, 'user.profiles[0].profile._json.locale'),
                timezone : _.get(configuration, 'user.profiles[0].profile._json.timezone'),
                facebookLink : _.get(configuration, 'user.profiles[0].profile._json.link'),
                name : _.get(configuration, 'user.profiles[0].profile._json.first_name') + ' '+ _.get(configuration, 'user.profiles[0].profile._json.last_name'),
                verfied : _.get(configuration, 'user.profiles[0].profile._json.verified')
            };
            
        } else if (_.get(configuration, 'user.profiles[0].provider') === 'google'){
            dataObj = {
                provider: 'google',
                email : _.get(configuration, 'user.profiles[0].profile._json.emails[0].value'),
                googleLink : _.get(configuration, 'user.profiles[0].profile._json.url'),
                avatar: _.get(configuration, 'user.profiles[0].profile._json.image.url'),
                name: _.get(configuration, 'user.profiles[0].profile._json.displayName'),
                verfied: _.get(configuration, 'user.profiles[0].profile._json.verified')
            };
            
        }

        return FirepolUser.prototype$updateAttributes(
            { id: configuration.user.id }, dataObj
        ).$promise;
    }

    function saveProfile(u) {
        console.log('returned user', u);
        return FirepolUser.UserProfile.create(
            { id: u.id }, 
            { 
                name: configuration.user.profiles[0].profile.displayName,
                sex: configuration.user.profiles[0].profile._json.gender
            }
        ).$promise;
    }

    if (configuration.user.profiles[0].created === configuration.user.profiles[0].modified){
        $q.resolve(true)
        .then(saveUser)
        .then(saveProfile)
        .catch(function(e){
            console.log(e);
        });

        // TODO: ask for username to continue 
        $state.transitionTo('user-profile');
    }else {
        $state.transitionTo('questions');
    }
}); 