module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    //frameworks: ['mocha*'],
    files: [
      'common/**/*integration.spec.js',
      'test/**/*.spec.js'
    ]
  });
};