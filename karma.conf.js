module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['mocha', 'chai'],
    plugins: [
        'karma-*'
    ],
    files: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular/angular-resource.js',
      //'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/mocha/mocha.js',
      'node_modules/chai/chai.js',
      'node_modules/sinon/pkg/sinon.js',
      'node_modules/sinon-chai/lib/sinon-chai.js',
      'node_modules/chai-jquery/chai-jquery.js',
      'node_modules/ng-midway-tester/src/ngMidwayTester.js',

      'client/js/lb-services.js',
      'common/**/*integration.spec.js',
      'test/**/*.spec.js'
    ],
    proxies: {
      '/': 'http://localhost:3000/'
    }
  });
};