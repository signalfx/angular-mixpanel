module.exports = {
  files: [
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'src/**/*.js'
  ],

  preprocessors: {
    '**/src/**/*.js': ['commonjs']
  },

  browsers: ['PhantomJS', 'Chrome']
};