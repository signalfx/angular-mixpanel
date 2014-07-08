var gulp = require('gulp'),
  boilerplate = require('boilerplate-gulp-angular');

boilerplate(gulp, {
  pkg: require('./package.json'),
  karmaConfig: require('./dev/karmaConfig'),
  disableCss: true
});