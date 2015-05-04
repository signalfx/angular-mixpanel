!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularMixpanel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

    this.$get = ['$window', '$log', function($window, $log) {
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
    }];
  });

},{"./createMixpanelDelegator":1}]},{},[2])

(2)
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vemFuL2NvZGUvYW5ndWxhci1taXhwYW5lbC9ub2RlX21vZHVsZXMvYm9pbGVycGxhdGUtZ3VscC1hbmd1bGFyL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvb3phbi9jb2RlL2FuZ3VsYXItbWl4cGFuZWwvc3JjL2NyZWF0ZU1peHBhbmVsRGVsZWdhdG9yLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9tb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYW5ndWxhci1taXhwYW5lbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKiBNaXhwYW5lbCBkeW5hbWljYWxseSByZXdyaXRlcyBpdCdzIG9iamVjdCBib3VuZCB0byB0aGUgd2luZG93IHVwb24gbG9hZGluZ1xuICBmcm9tIHRoZSBDRE4gb3JpZ2luLiBUaGlzIG1lYW5zIHRoYXQgaWYgYSByZWZlcmVuY2UgdG8gdGhlIG1peHBhbmVsIG9iamVjdFxuICBpcyBhY3F1aXJlZCBwcmlvciB0byB0aGUgbWl4cGFuZWwgc2NyaXB0IGxvYWRpbmcsIGl0IGJlY29tZXMgc3RhbGUuIFRoaXNcbiAgZmFjdG9yeSBjcmVhdGVzIGFuIGFwaSB3aGljaCBkaXNwYXRjaGVzIHRoZSBjYWxsIHRvIHRoZSBjdXJyZW50IG1peHBhbmVsXG4gIG9iamVjdCBib3VuZCB0byB0aGUgd2luZG93IGF0IGNhbGwtdGltZSwgZW5zdXJpbmcgdGhlIGNhbGxzIGdvIHRvIHRoZSByaWdodFxuICBwbGFjZS5cbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkd2luZG93LCBpbnN0YW5jZU5hbWUsIGRpc2FibGVkKSB7XG4gIGZ1bmN0aW9uIGdldE1peHBhbmVsSW5zdGFuY2UoKSB7XG4gICAgaWYoIWluc3RhbmNlTmFtZSkgcmV0dXJuICR3aW5kb3cubWl4cGFuZWw7XG4gICAgcmV0dXJuICR3aW5kb3cubWl4cGFuZWxbaW5zdGFuY2VOYW1lXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vb3AoKXt9XG5cbiAgdmFyIG1ldGhvZHMgPSBbXG4gICAgJ2luaXQnLFxuICAgICdwdXNoJyxcbiAgICAnZGlzYWJsZScsXG4gICAgJ3RyYWNrJyxcbiAgICAndHJhY2tfbGlua3MnLFxuICAgICd0cmFja19mb3JtcycsXG4gICAgJ3JlZ2lzdGVyJyxcbiAgICAncmVnaXN0ZXJfb25jZScsXG4gICAgJ3VucmVnaXN0ZXInLFxuICAgICdpZGVudGlmeScsXG4gICAgJ2dldF9kaXN0aW5jdF9pZCcsXG4gICAgJ2FsaWFzJyxcbiAgICAnc2V0X2NvbmZpZycsXG4gICAgJ2dldF9jb25maWcnLFxuICAgICdnZXRfcHJvcGVydHknXG4gIF07XG5cbiAgdmFyIHBlb3BsZU1ldGhvZHMgPSBbXG4gICAgJ3NldCcsXG4gICAgJ3NldF9vbmNlJyxcbiAgICAnaW5jcmVtZW50JyxcbiAgICAnYXBwZW5kJyxcbiAgICAndHJhY2tfY2hhcmdlJyxcbiAgICAnY2xlYXJfY2hhcmdlcycsXG4gICAgJ2RlbGV0ZV91c2VyJ1xuICBdO1xuXG4gIHZhciBhcGkgPSB7fTtcblxuICBtZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG4gICAgYXBpW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZihkaXNhYmxlZCkgcmV0dXJuIG5vb3A7XG5cbiAgICAgIHZhciBtaXhwYW5lbCA9IGdldE1peHBhbmVsSW5zdGFuY2UoKTtcbiAgICAgIHJldHVybiBtaXhwYW5lbFttZXRob2ROYW1lXS5hcHBseShtaXhwYW5lbCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICBhcGkucGVvcGxlID0ge307XG4gIHBlb3BsZU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcbiAgICBhcGkucGVvcGxlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmKGRpc2FibGVkKSByZXR1cm4gbm9vcDtcblxuICAgICAgdmFyIG1peHBhbmVsID0gZ2V0TWl4cGFuZWxJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIG1peHBhbmVsLnBlb3BsZVttZXRob2ROYW1lXS5hcHBseShtaXhwYW5lbC5wZW9wbGUsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFwaTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgYW5ndWxhciAqL1xuXG52YXIgY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IgPSByZXF1aXJlKCcuL2NyZWF0ZU1peHBhbmVsRGVsZWdhdG9yJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhbmFseXRpY3MubWl4cGFuZWwnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnbWl4cGFuZWxUcmFja0NsaWNrJywgWydtaXhwYW5lbCcsIGZ1bmN0aW9uKG1peHBhbmVsKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICBzY29wZToge1xuICAgICAgICAnbWl4cGFuZWxQcm9wZXJ0aWVzJzogJz0nXG4gICAgICB9LFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHIpIHtcbiAgICAgICAgZWxlbWVudC5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZXZlbnROYW1lID0gYXR0ci5taXhwYW5lbFRyYWNrQ2xpY2sgfHxcbiAgICAgICAgICAgIGVsZW1lbnQudmFsKCkgfHxcbiAgICAgICAgICAgIGVsZW1lbnQudGV4dCgpLFxuICAgICAgICAgICAgcHJvcGVydGllcyA9IHNjb3BlLm1peHBhbmVsUHJvcGVydGllcztcblxuICAgICAgICAgIG1peHBhbmVsLnRyYWNrKGV2ZW50TmFtZSwgcHJvcGVydGllcyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1dKVxuICAucHJvdmlkZXIoJ21peHBhbmVsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1peHBhbmVsSW5zdGFuY2UsIGRpc2FibGVkRXZlbnRzLCBkaXNhYmxlZDtcblxuICAgIC8vIEFsbG93IHRoZSBleHBsaWNpdCBwYXNzaW5nIGluIG9mIGEgbWl4cGFuZWwgb2JqZWN0XG4gICAgdGhpcy5taXhwYW5lbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBtaXhwYW5lbEluc3RhbmNlID0gdmFsdWU7XG4gICAgfTtcblxuICAgIHRoaXMudG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLmxpYnJhcnlOYW1lID0gJ2FuZ3VsYXInO1xuXG4gICAgLy8gRW5hYmxlcyBtdWx0aXBsZSBjYWxscyB0byBkaXNhYmxlIGV2ZW50cyB3aGljaCB3aWxsIGJlIGNvbGxlY3RlZCB0aGVuXG4gICAgLy8gYXBwbGllZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIElmIGRpc2FibGUgaXMgY2FsbGVkLCB0aGVuIGl0IG92ZXJyaWRlc1xuICAgIC8vIGFsbCBpbmRpdmlkdWFsIGV2ZW50IGRpc2FibGluZy5cbiAgICB0aGlzLmRpc2FibGUgPSBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShldmVudHMpKXtcbiAgICAgICAgaWYoIWRpc2FibGVkRXZlbnRzKSBkaXNhYmxlZEV2ZW50cyA9IFtdO1xuICAgICAgICBkaXNhYmxlZEV2ZW50cyA9IGRpc2FibGVkRXZlbnRzLmNvbmNhdChldmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLiRnZXQgPSBbJyR3aW5kb3cnLCAnJGxvZycsIGZ1bmN0aW9uKCR3aW5kb3csICRsb2cpIHtcbiAgICAgIC8vIElmIG5vIG1peHBhbmVsIGluc3RhbmNlIHdhcyBwYXNzZWQgaW50byB0aGlzIHByb3ZpZGVyLCB0aGVuXG4gICAgICAvLyB3ZSdsbCBjcmVhdGUgYSBuZXcgaW5zdGFuY2UgZnJvbSB0aGUgZ2xvYmFsIG1peHBhbmVsIG9iamVjdC5cbiAgICAgIC8vIFRoaXMgZW5zdXJlcyB3ZSBkb24ndCBvdmVyd3JpdGUgZXhpc3RpbmcgbWl4cGFuZWwgZGVwbG95bWVudHMuXG4gICAgICBpZiAoIW1peHBhbmVsSW5zdGFuY2UpIHtcbiAgICAgICAgaWYgKCEkd2luZG93Lm1peHBhbmVsKSB7XG4gICAgICAgICAgJGxvZy53YXJuKCdVbmFibGUgdG8gZmluZCBtaXhwYW5lbCwgaXMgdGhlIHRhZyBpbmNsdWRlZCBpbiB0aGUnICtcbiAgICAgICAgICAgICdwYWdlPycpO1xuXG4gICAgICAgICAgLy8gV2hlbiBubyBtaXhwYW5lbCBpbnN0YW5jZSBpcyBmb3VuZCBvbiB0aGUgd2luZG93LCBjcmVhdGVcbiAgICAgICAgICAvLyBhIG1vY2sgbWl4cGFuZWwgb2JqZWN0IHNvIHRoYXQgY2FsbHMgdG8gdGhlIGFwaSBkb24ndCBlcnJvci5cbiAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3Ioe1xuICAgICAgICAgICAgbWl4cGFuZWw6IHtcbiAgICAgICAgICAgICAgcGVvcGxlOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgbm8gdG9rZW4gaXMgcGFzc2VkLCB1c2UgdGhlIGV4aXN0aW5nIGdsb2JhbCBtaXhwYW5lbCBpbnN0YW5jZVxuICAgICAgICAgIGlmICh0aGlzLnRva2VuKSB7XG4gICAgICAgICAgICAvLyBJZiBhIHRva2VuIGlzIHBhc3NlZCwgdGhlbiBjcmVhdGUgYSBuZXcgbWl4cGFuZWwgaW5zdGVhbmNlXG4gICAgICAgICAgICAvLyBhbmQgcGFzcyB0aGUgaGFuZGxlciBmb3IgaXQuXG4gICAgICAgICAgICAkd2luZG93Lm1peHBhbmVsLmluaXQodGhpcy50b2tlbiwgdGhpcy5jb25maWcsIHRoaXMubGlicmFyeU5hbWUpO1xuXG4gICAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdywgdGhpcy5saWJyYXJ5TmFtZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoZGlzYWJsZWQpe1xuICAgICAgICAvLyBDcmVhdGUgYSBtb2NrIChub29wKSBpbnN0YW5jZSBvZiB0aGUgbWl4cGFuZWwgQVBJXG4gICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93LCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZEV2ZW50cyl7XG4gICAgICAgIG1peHBhbmVsSW5zdGFuY2UuZGlzYWJsZShkaXNhYmxlZEV2ZW50cyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtaXhwYW5lbEluc3RhbmNlO1xuICAgIH1dO1xuICB9KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==