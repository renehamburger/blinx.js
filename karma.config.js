
module.exports = function(config) {
  config.set({
    singleRun: true,

    //--- BrowserStack settings
    browserStack: {
      project: 'blinx.js'
    },
    customLaunchers: {
      bs_chrome: {
        base: 'BrowserStack',
        browser: 'Chrome',
        os: 'Windows',
        os_version: '10'
      }
    },
    browsers: ['bs_chrome', 'PhantomJS'],

    frameworks: [
      'jasmine'
    ],

    files: [
      'spec.bundle.js'
    ],

    preprocessors: {
      'spec.bundle.js': ['webpack']
    },

    webpack: require('./webpack-test.config'),

    webpackMiddleware: {
      stats: 'errors-only'
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-webpack')
    ],

    reporters: ['dots', 'BrowserStack']
  });
};
