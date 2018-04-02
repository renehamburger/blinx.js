function framework(files) {
  const file = require.resolve('karma-custom-framework').replace(/index\.js$/, 'typedarray.js');
  files.unshift({
    included: true,
    pattern: file,
    served: true,
    watched: true
  });
}

framework.$inject = ['config.files']

module.exports = {
  "framework:karma-custom-framework": ["factory", framework],
};
