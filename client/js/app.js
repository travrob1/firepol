/*global angular*/
var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.validate', 'lbServices']);

app.config(['$routeProvider', function($routProvider) {
    $routProvider
        .when('/', {
            templateUrl: 'js/marketing/marketing.html',
            controller: 'marketingCtrl'
        }).when('/register', {
            templateUrl: 'js/register/register.html',
            controller: 'registerSigninCtrl'
        }).when('/about-us', {
            templateUrl: 'js/about-us/about-us.html',
            controller: 'globalCtrl'
        }).when('/services', {
            templateUrl: 'js/services/services.html',
            controller: 'globalCtrl'
        }).when('/portfolio', {
            templateUrl: 'js/portfolio/portfolio.html',
            controller: 'globalCtrl'
        }).when('/career', {
            templateUrl: 'js/career/career.html',
            controller: 'globalCtrl'
        }).when('/blog', {
            templateUrl: 'js/blog/blog.html',
            controller: 'globalCtrl'
        }).when('/blog-item', {
            templateUrl: 'js/blog/blog-item.html',
            controller: 'globalCtrl'
        }).when('/faq', {
            templateUrl: 'js/faq/faq.html',
            controller: 'globalCtrl'
        }).when('/pricing', {
            templateUrl: 'js/pricing/pricing.html',
            controller: 'globalCtrl'
        }).when('/privacy', {
            templateUrl: 'js/terms-privacy/privacy.html',
            controller: 'globalCtrl'
        }).when('/terms', {
            templateUrl: 'js/terms-privacy/terms.html',
            controller: 'globalCtrl'
        }).when('/contact', {
            templateUrl: 'js/contact-us/contact.html',
            controller: 'globalCtrl'
        }).when('/404', {
            templateUrl: 'js/404/404.html',
            controller: 'globalCtrl'
        }).when('/user-profile', {
            templateUrl: 'js/user-profile/user-profile.html',
            controller: 'profileCtrl'
        }).otherwise({
            redirectTo: '/404'
        });
}]);

app.controller('globalCtrl', function($rootScope, $scope){
  
});