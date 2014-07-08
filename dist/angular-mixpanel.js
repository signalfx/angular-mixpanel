!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularMixpanel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';
/* global angular */

angular.module('analytics.mixpanel', [])
  .directive('mixpanelTrackClick', function(mixpanel) {
    return {
      restrict: 'A',
      scope: {
        'mixpanelProperties': '='
      },
      link: function(scope, element, attr) {
        element.on('click', function() {
          var eventName = attr.mixpanelTrackClick ||
            element.val() ||
            element.text(),
            properties = scope.mixpanelProperties;

          mixpanel.track(eventName, properties);
        });
      }
    };
  })
  .provider('mixpanel', function() {
    var mixpanelInstance;

    // Allow the explicit passing in of a mixpanel object
    this.mixpanel = function(value) {
      mixpanelInstance = value;
    };

    this.token = undefined;
    this.config = {};
    this.libraryName = 'angular';

    this.$get = function($window) {
      if (mixpanelInstance) return mixpanelInstance;

      // If no mixpanel instance was passed into this provider, then
      // we'll create a new instance from the global mixpanel object.
      // This ensures we don't overwrite existing mixpanel deployments.
      if (!$window.mixpanel) {
        throw new Error('Unable to find mixpanel, is the tag ' +
          'included in the page?');
      }

      // If no token is passed, use the existing global mixpanel instance
      if (!this.token) return $window.mixpanel;

      // If a token is passed, then create a new mixpanel insteance
      // and pass the handler for it.
      $window.mixpanel.init(this.token, this.config, this.libraryName);

      return $window.mixpanel[this.libraryName];
    };
  });
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvb3phbi9jb2RlL2JvaWxlcnBsYXRlLWd1bHAtYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuLyogZ2xvYmFsIGFuZ3VsYXIgKi9cblxuYW5ndWxhci5tb2R1bGUoJ2FuYWx5dGljcy5taXhwYW5lbCcsIFtdKVxuICAuZGlyZWN0aXZlKCdtaXhwYW5lbFRyYWNrQ2xpY2snLCBmdW5jdGlvbihtaXhwYW5lbCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgJ21peHBhbmVsUHJvcGVydGllcyc6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubWl4cGFuZWxUcmFja0NsaWNrIHx8XG4gICAgICAgICAgICBlbGVtZW50LnZhbCgpIHx8XG4gICAgICAgICAgICBlbGVtZW50LnRleHQoKSxcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBzY29wZS5taXhwYW5lbFByb3BlcnRpZXM7XG5cbiAgICAgICAgICBtaXhwYW5lbC50cmFjayhldmVudE5hbWUsIHByb3BlcnRpZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuICAucHJvdmlkZXIoJ21peHBhbmVsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1peHBhbmVsSW5zdGFuY2U7XG5cbiAgICAvLyBBbGxvdyB0aGUgZXhwbGljaXQgcGFzc2luZyBpbiBvZiBhIG1peHBhbmVsIG9iamVjdFxuICAgIHRoaXMubWl4cGFuZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbWl4cGFuZWxJbnN0YW5jZSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICB0aGlzLnRva2VuID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgdGhpcy5saWJyYXJ5TmFtZSA9ICdhbmd1bGFyJztcblxuICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgICAgIGlmIChtaXhwYW5lbEluc3RhbmNlKSByZXR1cm4gbWl4cGFuZWxJbnN0YW5jZTtcblxuICAgICAgLy8gSWYgbm8gbWl4cGFuZWwgaW5zdGFuY2Ugd2FzIHBhc3NlZCBpbnRvIHRoaXMgcHJvdmlkZXIsIHRoZW5cbiAgICAgIC8vIHdlJ2xsIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBmcm9tIHRoZSBnbG9iYWwgbWl4cGFuZWwgb2JqZWN0LlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHdlIGRvbid0IG92ZXJ3cml0ZSBleGlzdGluZyBtaXhwYW5lbCBkZXBsb3ltZW50cy5cbiAgICAgIGlmICghJHdpbmRvdy5taXhwYW5lbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIG1peHBhbmVsLCBpcyB0aGUgdGFnICcgK1xuICAgICAgICAgICdpbmNsdWRlZCBpbiB0aGUgcGFnZT8nKTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgbm8gdG9rZW4gaXMgcGFzc2VkLCB1c2UgdGhlIGV4aXN0aW5nIGdsb2JhbCBtaXhwYW5lbCBpbnN0YW5jZVxuICAgICAgaWYgKCF0aGlzLnRva2VuKSByZXR1cm4gJHdpbmRvdy5taXhwYW5lbDtcblxuICAgICAgLy8gSWYgYSB0b2tlbiBpcyBwYXNzZWQsIHRoZW4gY3JlYXRlIGEgbmV3IG1peHBhbmVsIGluc3RlYW5jZVxuICAgICAgLy8gYW5kIHBhc3MgdGhlIGhhbmRsZXIgZm9yIGl0LlxuICAgICAgJHdpbmRvdy5taXhwYW5lbC5pbml0KHRoaXMudG9rZW4sIHRoaXMuY29uZmlnLCB0aGlzLmxpYnJhcnlOYW1lKTtcblxuICAgICAgcmV0dXJuICR3aW5kb3cubWl4cGFuZWxbdGhpcy5saWJyYXJ5TmFtZV07XG4gICAgfTtcbiAgfSk7Il19
(1)
});
