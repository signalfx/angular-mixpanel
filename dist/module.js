!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.module=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

/* Mixpanel dynamically rewrites it's object bound to the window upon loading
  from the CDN origin. This means that if a reference to the mixpanel object
  is acquired prior to the mixpanel script loading, it becomes stale. This
  factory creates an api which dispatches the call to the current mixpanel
  object bound to the window at call-time, ensuring the calls go to the right
  place.
*/
module.exports = function ($window, instanceName, disabled) {
  function getMixpanelInstance() {
    if(!instanceName) return $window.mixpanel;
    return $window.mixpanel[instanceName];
  }

  function noop(){}

  var methods = [
    'init',
    'push',
    'disable',
    'track',
    'track_links',
    'track_forms',
    'register',
    'register_once',
    'unregister',
    'identify',
    'get_distinct_id',
    'alias',
    'set_config',
    'get_config',
    'get_property'
  ];

  var peopleMethods = [
    'set',
    'set_once',
    'increment',
    'append',
    'track_charge',
    'clear_charges',
    'delete_user'
  ];

  var api = {};

  methods.forEach(function(methodName){
    api[methodName] = function() {
      if(disabled) return noop;

      var mixpanel = getMixpanelInstance();
      return mixpanel[methodName].apply(mixpanel, arguments);
    };
  });

  api.people = {};
  peopleMethods.forEach(function(methodName){
    api.people[methodName] = function(){
      if(disabled) return noop;

      var mixpanel = getMixpanelInstance();
      return mixpanel.people[methodName].apply(mixpanel.people, arguments);
    };
  });

  return api;
};

},{}],2:[function(_dereq_,module,exports){
'use strict';
/* global angular */

var createMixpanelDelegator = _dereq_('./createMixpanelDelegator');

angular.module('analytics.mixpanel', [])
  .directive('mixpanelTrackClick', ['mixpanel', function(mixpanel) {
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
  }])
  .provider('mixpanel', function() {
    var mixpanelInstance, disabledEvents, disabled;

    // Allow the explicit passing in of a mixpanel object
    this.mixpanel = function(value) {
      mixpanelInstance = value;
    };

    this.token = undefined;
    this.config = {};
    this.libraryName = 'angular';

    // Enables multiple calls to disable events which will be collected then
    // applied during initialization. If disable is called, then it overrides
    // all individual event disabling.
    this.disable = function(events) {
      if(angular.isArray(events)){
        if(!disabledEvents) disabledEvents = [];
        disabledEvents = disabledEvents.concat(events);
      } else {
        disabled = true;
      }
    };

    this.$get = function($window, $log) {
      // If no mixpanel instance was passed into this provider, then
      // we'll create a new instance from the global mixpanel object.
      // This ensures we don't overwrite existing mixpanel deployments.
      if (!mixpanelInstance) {
        if (!$window.mixpanel) {
          $log.warn('Unable to find mixpanel, is the tag included in the' +
            'page?');

          // When no mixpanel instance is found on the window, create
          // a mock mixpanel object so that calls to the api don't error.
          mixpanelInstance = createMixpanelDelegator({
            mixpanel: {
              people: {}
            }
          }, undefined, true);
        } else {
          // If no token is passed, use the existing global mixpanel instance
          if (this.token) {
            // If a token is passed, then create a new mixpanel insteance
            // and pass the handler for it.
            $window.mixpanel.init(this.token, this.config, this.libraryName);

            mixpanelInstance = createMixpanelDelegator($window, this.libraryName);
          } else {
            mixpanelInstance = createMixpanelDelegator($window);
          }
        }
      }

      if(disabled){
        // Create a mock (noop) instance of the mixpanel API
        mixpanelInstance = createMixpanelDelegator($window, undefined, true);
      } else if (disabledEvents){
        mixpanelInstance.disable(disabledEvents);
      }

      return mixpanelInstance;
    };
  });

},{"./createMixpanelDelegator":1}]},{},[2])

(2)
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vemFuL2NvZGUvYW5ndWxhci1taXhwYW5lbC9ub2RlX21vZHVsZXMvYm9pbGVycGxhdGUtZ3VscC1hbmd1bGFyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvb3phbi9jb2RlL2FuZ3VsYXItbWl4cGFuZWwvc3JjL2NyZWF0ZU1peHBhbmVsRGVsZWdhdG9yLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbi8qIE1peHBhbmVsIGR5bmFtaWNhbGx5IHJld3JpdGVzIGl0J3Mgb2JqZWN0IGJvdW5kIHRvIHRoZSB3aW5kb3cgdXBvbiBsb2FkaW5nXG4gIGZyb20gdGhlIENETiBvcmlnaW4uIFRoaXMgbWVhbnMgdGhhdCBpZiBhIHJlZmVyZW5jZSB0byB0aGUgbWl4cGFuZWwgb2JqZWN0XG4gIGlzIGFjcXVpcmVkIHByaW9yIHRvIHRoZSBtaXhwYW5lbCBzY3JpcHQgbG9hZGluZywgaXQgYmVjb21lcyBzdGFsZS4gVGhpc1xuICBmYWN0b3J5IGNyZWF0ZXMgYW4gYXBpIHdoaWNoIGRpc3BhdGNoZXMgdGhlIGNhbGwgdG8gdGhlIGN1cnJlbnQgbWl4cGFuZWxcbiAgb2JqZWN0IGJvdW5kIHRvIHRoZSB3aW5kb3cgYXQgY2FsbC10aW1lLCBlbnN1cmluZyB0aGUgY2FsbHMgZ28gdG8gdGhlIHJpZ2h0XG4gIHBsYWNlLlxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR3aW5kb3csIGluc3RhbmNlTmFtZSwgZGlzYWJsZWQpIHtcbiAgZnVuY3Rpb24gZ2V0TWl4cGFuZWxJbnN0YW5jZSgpIHtcbiAgICBpZighaW5zdGFuY2VOYW1lKSByZXR1cm4gJHdpbmRvdy5taXhwYW5lbDtcbiAgICByZXR1cm4gJHdpbmRvdy5taXhwYW5lbFtpbnN0YW5jZU5hbWVdO1xuICB9XG5cbiAgZnVuY3Rpb24gbm9vcCgpe31cblxuICB2YXIgbWV0aG9kcyA9IFtcbiAgICAnaW5pdCcsXG4gICAgJ3B1c2gnLFxuICAgICdkaXNhYmxlJyxcbiAgICAndHJhY2snLFxuICAgICd0cmFja19saW5rcycsXG4gICAgJ3RyYWNrX2Zvcm1zJyxcbiAgICAncmVnaXN0ZXInLFxuICAgICdyZWdpc3Rlcl9vbmNlJyxcbiAgICAndW5yZWdpc3RlcicsXG4gICAgJ2lkZW50aWZ5JyxcbiAgICAnZ2V0X2Rpc3RpbmN0X2lkJyxcbiAgICAnYWxpYXMnLFxuICAgICdzZXRfY29uZmlnJyxcbiAgICAnZ2V0X2NvbmZpZycsXG4gICAgJ2dldF9wcm9wZXJ0eSdcbiAgXTtcblxuICB2YXIgcGVvcGxlTWV0aG9kcyA9IFtcbiAgICAnc2V0JyxcbiAgICAnc2V0X29uY2UnLFxuICAgICdpbmNyZW1lbnQnLFxuICAgICdhcHBlbmQnLFxuICAgICd0cmFja19jaGFyZ2UnLFxuICAgICdjbGVhcl9jaGFyZ2VzJyxcbiAgICAnZGVsZXRlX3VzZXInXG4gIF07XG5cbiAgdmFyIGFwaSA9IHt9O1xuXG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcbiAgICBhcGlbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmKGRpc2FibGVkKSByZXR1cm4gbm9vcDtcblxuICAgICAgdmFyIG1peHBhbmVsID0gZ2V0TWl4cGFuZWxJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIG1peHBhbmVsW21ldGhvZE5hbWVdLmFwcGx5KG1peHBhbmVsLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIGFwaS5wZW9wbGUgPSB7fTtcbiAgcGVvcGxlTWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpe1xuICAgIGFwaS5wZW9wbGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpe1xuICAgICAgaWYoZGlzYWJsZWQpIHJldHVybiBub29wO1xuXG4gICAgICB2YXIgbWl4cGFuZWwgPSBnZXRNaXhwYW5lbEluc3RhbmNlKCk7XG4gICAgICByZXR1cm4gbWl4cGFuZWwucGVvcGxlW21ldGhvZE5hbWVdLmFwcGx5KG1peHBhbmVsLnBlb3BsZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gYXBpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbnZhciBjcmVhdGVNaXhwYW5lbERlbGVnYXRvciA9IHJlcXVpcmUoJy4vY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3InKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FuYWx5dGljcy5taXhwYW5lbCcsIFtdKVxuICAuZGlyZWN0aXZlKCdtaXhwYW5lbFRyYWNrQ2xpY2snLCBbJ21peHBhbmVsJywgZnVuY3Rpb24obWl4cGFuZWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgICdtaXhwYW5lbFByb3BlcnRpZXMnOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBldmVudE5hbWUgPSBhdHRyLm1peHBhbmVsVHJhY2tDbGljayB8fFxuICAgICAgICAgICAgZWxlbWVudC52YWwoKSB8fFxuICAgICAgICAgICAgZWxlbWVudC50ZXh0KCksXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gc2NvcGUubWl4cGFuZWxQcm9wZXJ0aWVzO1xuXG4gICAgICAgICAgbWl4cGFuZWwudHJhY2soZXZlbnROYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfV0pXG4gIC5wcm92aWRlcignbWl4cGFuZWwnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWl4cGFuZWxJbnN0YW5jZSwgZGlzYWJsZWRFdmVudHMsIGRpc2FibGVkO1xuXG4gICAgLy8gQWxsb3cgdGhlIGV4cGxpY2l0IHBhc3NpbmcgaW4gb2YgYSBtaXhwYW5lbCBvYmplY3RcbiAgICB0aGlzLm1peHBhbmVsID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSB2YWx1ZTtcbiAgICB9O1xuXG4gICAgdGhpcy50b2tlbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIHRoaXMubGlicmFyeU5hbWUgPSAnYW5ndWxhcic7XG5cbiAgICAvLyBFbmFibGVzIG11bHRpcGxlIGNhbGxzIHRvIGRpc2FibGUgZXZlbnRzIHdoaWNoIHdpbGwgYmUgY29sbGVjdGVkIHRoZW5cbiAgICAvLyBhcHBsaWVkIGR1cmluZyBpbml0aWFsaXphdGlvbi4gSWYgZGlzYWJsZSBpcyBjYWxsZWQsIHRoZW4gaXQgb3ZlcnJpZGVzXG4gICAgLy8gYWxsIGluZGl2aWR1YWwgZXZlbnQgZGlzYWJsaW5nLlxuICAgIHRoaXMuZGlzYWJsZSA9IGZ1bmN0aW9uKGV2ZW50cykge1xuICAgICAgaWYoYW5ndWxhci5pc0FycmF5KGV2ZW50cykpe1xuICAgICAgICBpZighZGlzYWJsZWRFdmVudHMpIGRpc2FibGVkRXZlbnRzID0gW107XG4gICAgICAgIGRpc2FibGVkRXZlbnRzID0gZGlzYWJsZWRFdmVudHMuY29uY2F0KGV2ZW50cyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuJGdldCA9IGZ1bmN0aW9uKCR3aW5kb3csICRsb2cpIHtcbiAgICAgIC8vIElmIG5vIG1peHBhbmVsIGluc3RhbmNlIHdhcyBwYXNzZWQgaW50byB0aGlzIHByb3ZpZGVyLCB0aGVuXG4gICAgICAvLyB3ZSdsbCBjcmVhdGUgYSBuZXcgaW5zdGFuY2UgZnJvbSB0aGUgZ2xvYmFsIG1peHBhbmVsIG9iamVjdC5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB3ZSBkb24ndCBvdmVyd3JpdGUgZXhpc3RpbmcgbWl4cGFuZWwgZGVwbG95bWVudHMuXG4gICAgICBpZiAoIW1peHBhbmVsSW5zdGFuY2UpIHtcbiAgICAgICAgaWYgKCEkd2luZG93Lm1peHBhbmVsKSB7XG4gICAgICAgICAgJGxvZy53YXJuKCdVbmFibGUgdG8gZmluZCBtaXhwYW5lbCwgaXMgdGhlIHRhZyBpbmNsdWRlZCBpbiB0aGUnICtcbiAgICAgICAgICAgICdwYWdlPycpO1xuXG4gICAgICAgICAgLy8gV2hlbiBubyBtaXhwYW5lbCBpbnN0YW5jZSBpcyBmb3VuZCBvbiB0aGUgd2luZG93LCBjcmVhdGVcbiAgICAgICAgICAvLyBhIG1vY2sgbWl4cGFuZWwgb2JqZWN0IHNvIHRoYXQgY2FsbHMgdG8gdGhlIGFwaSBkb24ndCBlcnJvci5cbiAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3Ioe1xuICAgICAgICAgICAgbWl4cGFuZWw6IHtcbiAgICAgICAgICAgICAgcGVvcGxlOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm8gdG9rZW4gaXMgcGFzc2VkLCB1c2UgdGhlIGV4aXN0aW5nIGdsb2JhbCBtaXhwYW5lbCBpbnN0YW5jZVxuICAgICAgICAgIGlmICh0aGlzLnRva2VuKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHRva2VuIGlzIHBhc3NlZCwgdGhlbiBjcmVhdGUgYSBuZXcgbWl4cGFuZWwgaW5zdGVhbmNlXG4gICAgICAgICAgICAvLyBhbmQgcGFzcyB0aGUgaGFuZGxlciBmb3IgaXQuXG4gICAgICAgICAgICAkd2luZG93Lm1peHBhbmVsLmluaXQodGhpcy50b2tlbiwgdGhpcy5jb25maWcsIHRoaXMubGlicmFyeU5hbWUpO1xuXG4gICAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdywgdGhpcy5saWJyYXJ5TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoZGlzYWJsZWQpe1xuICAgICAgICAvLyBDcmVhdGUgYSBtb2NrIChub29wKSBpbnN0YW5jZSBvZiB0aGUgbWl4cGFuZWwgQVBJXG4gICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93LCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZEV2ZW50cyl7XG4gICAgICAgIG1peHBhbmVsSW5zdGFuY2UuZGlzYWJsZShkaXNhYmxlZEV2ZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtaXhwYW5lbEluc3RhbmNlO1xuICAgIH07XG4gIH0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9