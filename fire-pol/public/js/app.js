var app = angular.module('app', ['app.config','ngRoute', 'ngResource','ui.validate']);

app.config(['$routeProvider', function($routProvider) {
    $routProvider
        .when('/', {
            templateUrl: 'js/splash/splash.html',
            controller: 'splashCtrl',
        });
}]);

app.controller('globalCtrl', ['$rootScope', '$scope', '$location', 'Auth',function($rootScope, $scope, $location, Auth){
    $rootScope.user = Auth.user;

    $scope.$on('$routeChangeStart', function(next, current) { 
        $scope.path = $location.$$path;
        if($scope.path === '/' ){
            $scope.isHome = true;
        }else {
            $scope.isHome = false;
        }
        
     });
}]);