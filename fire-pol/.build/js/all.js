//'ngRoute', 'ngResource','ui.validate'
var app = angular.module('app', []);

app.config(['$routeProvider', function($routProvider) {
    $routProvider
        .when('/', {
            templateUrl: 'js/marketing/marketing.html',
            controller: 'marketingCtrl',
        });
}]);

app.controller('globalCtrl', ['$rootScope', '$scope',function($rootScope, $scope){
   
}]);
/*global angular*/

angular.module('app')
.controller('marketingCtrl',function($scope){
    $scope.test= true;
});