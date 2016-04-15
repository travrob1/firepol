var app = angular.module('app', ['ngRoute', 'ngResource', 'ui.validate']);

app.config(['$routeProvider', function($routProvider) {
    $routProvider
        .when('/', {
            templateUrl: 'js/marketing/marketing.html',
            controller: 'marketingCtrl',
        }).when('/register', {
            templateUrl: 'js/register/register.html',
            controller: 'registerSigninCtrl',
        }).when('/about-us', {
            templateUrl: 'js/about-us/about-us.html',
            controller: 'globalCtrl',
        });
}]);

app.controller('globalCtrl', ['$rootScope', '$scope',function($rootScope, $scope){
   
}]);
/*global angular*/

angular.module('app')
.controller('marketingCtrl',function($scope){
    $scope.test= true;
});
/*global angular*/

angular.module('app')
.controller('registerSigninCtrl',function($scope){
    $scope.register= true;
});