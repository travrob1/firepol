'use strict';
/* globals angular, mocha */
mocha.setup({ timeout: 5000 });

function apiErrorHandler(err) {
    console.error(JSON.stringify(err, null, 4));
}

var Dconsole = {
    error: function (x) {
        console.error(JSON.stringify(x, null, 2));
    }
}

var $rootScope, $injector, testIdentifier;
(function() {
    testIdentifier = Math.random();
    function installGlobals(_rootScope, _injector) {
        $rootScope = _rootScope;
        $injector = _injector;
    }
    angular.module('testApp', ['lbServices'])
        .run(function($rootScope, $injector) {
            installGlobals($rootScope, $injector);
        });

    angular.element('body').append('<div class="testDiv"></div>');
    var doc = angular.element('div.testDiv')[0];
    angular.bootstrap(doc, ['testApp']);
 })();