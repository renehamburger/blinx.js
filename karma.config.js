module.exports = function (karmaConfig) {
  const withCoverage = process.argv.some((arg) => arg === '-coverage');
  const isVerbose = process.argv.some((arg) => arg === '-verbose');
  const browserArgPosition = process.argv.findIndex((arg) => arg === '--browsers');
  const browserStack =
    browserArgPosition === -1 || !/^Chrome/.test(process.argv[browserArgPosition + 1]);

  const config = {
    browserDisconnectTolerance: browserStack ? 2 : 0,
    browserNoActivityTimeout: 20000,
    client: { args: isVerbose ? ['verbose'] : [] },
    //logLevel: isVerbose ? karmaConfig.LOG_DEBUG : karmaConfig.LOG_INFO,
    browserStack: {
      project: 'blinx.js'
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeDebugging: {
        base: 'Chrome',
        flags: ['--remote-debugging-port=9333']
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
      win7_ie9: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '7',
        browser: 'IE',
        browser_version: '9'
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
      win10_firefox: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Firefox'
      },
      win10_opera: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Opera'
      },
      win10_edge: {
        base: 'BrowserStack',
        os: 'Windows',
        os_version: '10',
        browser: 'Edge'
      },
      osx_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Snow Leopard',
        browser: 'Safari'
      },
      osx_10_6_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'Snow Leopard',
        browser: 'Safari'
      },
      osx_10_13_safari: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'High Sierra',
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
      }
    },
    browsers: [
      'winxp_chrome',
      'winxp_firefox',
      'winxp_opera',
      'win7_ie9',
      'win7_ie10',
      'win7_ie11',
      'win10_chrome',
      'win10_firefox',
      'win10_opera',
      'win10_edge',
      'osx_10_6_safari',
      'osx_10_13_safari',
      'iphone4s',
      'ipad2',
      'google_nexus'
    ],
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      'src/**/!(*.spec).ts',
      browserStack ? 'src/**/browserstack.spec.ts' : 'src/**/!(browserstack).spec.ts'
    ],
    preprocessors: {
      'src/**/*.ts': ['karma-typescript'],
      'src/**/*.js': ['karma-typescript']
    },
    reporters: ['spec', 'BrowserStack', 'karma-typescript'],
    karmaTypescriptConfig: {
      tsconfig: './tsconfig.json',
      coverageOptions: {
        instrumentation: false
      }
    }
  };

  if (withCoverage) {
    Object.assign(config.karmaTypescriptConfig, {
      coverageOptions: {
        instrumentation: true
      },
      reports: {
        lcovonly: {
          subdirectory: '',
          filename: 'lcov.info'
        },
        html: 'coverage',
        'text-summary': ''
      }
    });
  }

  karmaConfig.set(config);
};
