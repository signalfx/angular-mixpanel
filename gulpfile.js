var gulp = require('gulp'),
  boilerplate = require('boilerplate-gulp-angular');

boilerplate(gulp, {
  pkg: require('./package.json'),
  jsMain: './src/module.js',
  name: 'angular-mixpanel',
  karmaConfig: require('./dev/karmaConfig'),
  disableCss: true
});
