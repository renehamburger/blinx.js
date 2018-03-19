
module.exports = function(config) {
  config.set({
    singleRun: true,

    browserDisconnectTimeout: 20000,

    //--- BrowserStack settings
    browserStack: {
      project: 'blinx.js'
    },
    customLaunchers: {
      ChromeDebugging: {
        base: 'Chrome',
        flags: [ '--remote-debugging-port=9333' ]
      },
      winxp_chrome: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: 'XP',
        browser: 'Chrome'
      },
      winxp_firefox: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: 'XP',
        browser: 'Firefox'
      },
      winxp_opera: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: 'XP',
        browser: 'Opera'
      },
      win7_ie10: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'IE',
        browser_version: '10'
      },
      win7_ie11: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'IE',
        browser_version: '11'
      },
      win10_chrome: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Chrome'
      },
      osx_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Snow Leopard',
        browser: 'Safari'
      },
      iphone4s: {
        base: 'BrowserStack',
        device: 'iPhone 4S',
        os: 'iOS',
        os_version: '5.1'
      },
      ipad2: {
        base: 'BrowserStack',
        device: 'iPad 2 (5.0)',
        os: 'iOS',
        os_version: '5.0'
      },
      google_nexus: {
        base: 'BrowserStack',
        device: 'Google Nexus',
        os: 'Android',
        os_version: '4.0'
      },
      kindle_fire: {
        base: 'BrowserStack',
        device: 'Amazon Kindle Fire HD 8.9',
        os: 'Android',
        os_version: '4.0'
      }
    },
    browsers: [
      'winxp_chrome', 'winxp_firefox', 'winxp_opera',
      'win7_ie10', 'win7_ie11', 'win10_chrome',
      'osx_safari', 'iphone4s', 'ipad2',
      'google_nexus', 'kindle_fire'],

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
      require('karma-chrome-launcher'),
      require('karma-browserstack-launcher'),
      require('karma-webpack')
    ],

    reporters: ['dots', 'BrowserStack']
  });
};
