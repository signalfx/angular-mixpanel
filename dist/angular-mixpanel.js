!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularMixpanel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvb3phbi9jb2RlL2JvaWxlcnBsYXRlLWd1bHAtYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9jcmVhdGVNaXhwYW5lbERlbGVnYXRvci5qcyIsIi9Vc2Vycy9vemFuL2NvZGUvYW5ndWxhci1taXhwYW5lbC9zcmMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogTWl4cGFuZWwgZHluYW1pY2FsbHkgcmV3cml0ZXMgaXQncyBvYmplY3QgYm91bmQgdG8gdGhlIHdpbmRvdyB1cG9uIGxvYWRpbmdcbiAgZnJvbSB0aGUgQ0ROIG9yaWdpbi4gVGhpcyBtZWFucyB0aGF0IGlmIGEgcmVmZXJlbmNlIHRvIHRoZSBtaXhwYW5lbCBvYmplY3RcbiAgaXMgYWNxdWlyZWQgcHJpb3IgdG8gdGhlIG1peHBhbmVsIHNjcmlwdCBsb2FkaW5nLCBpdCBiZWNvbWVzIHN0YWxlLiBUaGlzXG4gIGZhY3RvcnkgY3JlYXRlcyBhbiBhcGkgd2hpY2ggZGlzcGF0Y2hlcyB0aGUgY2FsbCB0byB0aGUgY3VycmVudCBtaXhwYW5lbFxuICBvYmplY3QgYm91bmQgdG8gdGhlIHdpbmRvdyBhdCBjYWxsLXRpbWUsIGVuc3VyaW5nIHRoZSBjYWxscyBnbyB0byB0aGUgcmlnaHRcbiAgcGxhY2UuXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHdpbmRvdywgaW5zdGFuY2VOYW1lLCBkaXNhYmxlZCkge1xuICBmdW5jdGlvbiBnZXRNaXhwYW5lbEluc3RhbmNlKCkge1xuICAgIGlmKCFpbnN0YW5jZU5hbWUpIHJldHVybiAkd2luZG93Lm1peHBhbmVsO1xuICAgIHJldHVybiAkd2luZG93Lm1peHBhbmVsW2luc3RhbmNlTmFtZV07XG4gIH1cblxuICBmdW5jdGlvbiBub29wKCl7fVxuXG4gIHZhciBtZXRob2RzID0gW1xuICAgICdpbml0JyxcbiAgICAncHVzaCcsXG4gICAgJ2Rpc2FibGUnLFxuICAgICd0cmFjaycsXG4gICAgJ3RyYWNrX2xpbmtzJyxcbiAgICAndHJhY2tfZm9ybXMnLFxuICAgICdyZWdpc3RlcicsXG4gICAgJ3JlZ2lzdGVyX29uY2UnLFxuICAgICd1bnJlZ2lzdGVyJyxcbiAgICAnaWRlbnRpZnknLFxuICAgICdnZXRfZGlzdGluY3RfaWQnLFxuICAgICdhbGlhcycsXG4gICAgJ3NldF9jb25maWcnLFxuICAgICdnZXRfY29uZmlnJyxcbiAgICAnZ2V0X3Byb3BlcnR5J1xuICBdO1xuXG4gIHZhciBwZW9wbGVNZXRob2RzID0gW1xuICAgICdzZXQnLFxuICAgICdzZXRfb25jZScsXG4gICAgJ2luY3JlbWVudCcsXG4gICAgJ2FwcGVuZCcsXG4gICAgJ3RyYWNrX2NoYXJnZScsXG4gICAgJ2NsZWFyX2NoYXJnZXMnLFxuICAgICdkZWxldGVfdXNlcidcbiAgXTtcblxuICB2YXIgYXBpID0ge307XG5cbiAgbWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpe1xuICAgIGFwaVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYoZGlzYWJsZWQpIHJldHVybiBub29wO1xuXG4gICAgICB2YXIgbWl4cGFuZWwgPSBnZXRNaXhwYW5lbEluc3RhbmNlKCk7XG4gICAgICByZXR1cm4gbWl4cGFuZWxbbWV0aG9kTmFtZV0uYXBwbHkobWl4cGFuZWwsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG5cbiAgYXBpLnBlb3BsZSA9IHt9O1xuICBwZW9wbGVNZXRob2RzLmZvckVhY2goZnVuY3Rpb24obWV0aG9kTmFtZSl7XG4gICAgYXBpLnBlb3BsZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpZihkaXNhYmxlZCkgcmV0dXJuIG5vb3A7XG4gICAgICBcbiAgICAgIHZhciBtaXhwYW5lbCA9IGdldE1peHBhbmVsSW5zdGFuY2UoKTtcbiAgICAgIHJldHVybiBtaXhwYW5lbC5wZW9wbGVbbWV0aG9kTmFtZV0uYXBwbHkobWl4cGFuZWwucGVvcGxlLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBhcGk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbnZhciBjcmVhdGVNaXhwYW5lbERlbGVnYXRvciA9IHJlcXVpcmUoJy4vY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3InKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FuYWx5dGljcy5taXhwYW5lbCcsIFtdKVxuICAuZGlyZWN0aXZlKCdtaXhwYW5lbFRyYWNrQ2xpY2snLCBmdW5jdGlvbihtaXhwYW5lbCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgJ21peHBhbmVsUHJvcGVydGllcyc6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubWl4cGFuZWxUcmFja0NsaWNrIHx8XG4gICAgICAgICAgICBlbGVtZW50LnZhbCgpIHx8XG4gICAgICAgICAgICBlbGVtZW50LnRleHQoKSxcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBzY29wZS5taXhwYW5lbFByb3BlcnRpZXM7XG5cbiAgICAgICAgICBtaXhwYW5lbC50cmFjayhldmVudE5hbWUsIHByb3BlcnRpZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuICAucHJvdmlkZXIoJ21peHBhbmVsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1peHBhbmVsSW5zdGFuY2UsIGRpc2FibGVkRXZlbnRzLCBkaXNhYmxlZDtcblxuICAgIC8vIEFsbG93IHRoZSBleHBsaWNpdCBwYXNzaW5nIGluIG9mIGEgbWl4cGFuZWwgb2JqZWN0XG4gICAgdGhpcy5taXhwYW5lbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBtaXhwYW5lbEluc3RhbmNlID0gdmFsdWU7XG4gICAgfTtcblxuICAgIHRoaXMudG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLmxpYnJhcnlOYW1lID0gJ2FuZ3VsYXInO1xuXG4gICAgLy8gRW5hYmxlcyBtdWx0aXBsZSBjYWxscyB0byBkaXNhYmxlIGV2ZW50cyB3aGljaCB3aWxsIGJlIGNvbGxlY3RlZCB0aGVuXG4gICAgLy8gYXBwbGllZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIElmIGRpc2FibGUgaXMgY2FsbGVkLCB0aGVuIGl0IG92ZXJyaWRlc1xuICAgIC8vIGFsbCBpbmRpdmlkdWFsIGV2ZW50IGRpc2FibGluZy5cbiAgICB0aGlzLmRpc2FibGUgPSBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShldmVudHMpKXtcbiAgICAgICAgaWYoIWRpc2FibGVkRXZlbnRzKSBkaXNhYmxlZEV2ZW50cyA9IFtdO1xuICAgICAgICBkaXNhYmxlZEV2ZW50cyA9IGRpc2FibGVkRXZlbnRzLmNvbmNhdChldmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbigkd2luZG93LCAkbG9nKSB7XG4gICAgICAvLyBJZiBubyBtaXhwYW5lbCBpbnN0YW5jZSB3YXMgcGFzc2VkIGludG8gdGhpcyBwcm92aWRlciwgdGhlblxuICAgICAgLy8gd2UnbGwgY3JlYXRlIGEgbmV3IGluc3RhbmNlIGZyb20gdGhlIGdsb2JhbCBtaXhwYW5lbCBvYmplY3QuXG4gICAgICAvLyBUaGlzIGVuc3VyZXMgd2UgZG9uJ3Qgb3ZlcndyaXRlIGV4aXN0aW5nIG1peHBhbmVsIGRlcGxveW1lbnRzLlxuICAgICAgaWYgKCFtaXhwYW5lbEluc3RhbmNlKSB7IFxuICAgICAgICBpZiAoISR3aW5kb3cubWl4cGFuZWwpIHtcbiAgICAgICAgICAkbG9nLndhcm4oJ1VuYWJsZSB0byBmaW5kIG1peHBhbmVsLCBpcyB0aGUgdGFnIGluY2x1ZGVkIGluIHRoZScgK1xuICAgICAgICAgICAgJ3BhZ2U/Jyk7XG5cbiAgICAgICAgICAvLyBXaGVuIG5vIG1peHBhbmVsIGluc3RhbmNlIGlzIGZvdW5kIG9uIHRoZSB3aW5kb3csIGNyZWF0ZVxuICAgICAgICAgIC8vIGEgbW9jayBtaXhwYW5lbCBvYmplY3Qgc28gdGhhdCBjYWxscyB0byB0aGUgYXBpIGRvbid0IGVycm9yLiAgICAgICAgIFxuICAgICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcih7XG4gICAgICAgICAgICBtaXhwYW5lbDoge1xuICAgICAgICAgICAgICBwZW9wbGU6IHt9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBubyB0b2tlbiBpcyBwYXNzZWQsIHVzZSB0aGUgZXhpc3RpbmcgZ2xvYmFsIG1peHBhbmVsIGluc3RhbmNlXG4gICAgICAgICAgaWYgKHRoaXMudG9rZW4pIHtcbiAgICAgICAgICAgIC8vIElmIGEgdG9rZW4gaXMgcGFzc2VkLCB0aGVuIGNyZWF0ZSBhIG5ldyBtaXhwYW5lbCBpbnN0ZWFuY2VcbiAgICAgICAgICAgIC8vIGFuZCBwYXNzIHRoZSBoYW5kbGVyIGZvciBpdC5cbiAgICAgICAgICAgICR3aW5kb3cubWl4cGFuZWwuaW5pdCh0aGlzLnRva2VuLCB0aGlzLmNvbmZpZywgdGhpcy5saWJyYXJ5TmFtZSk7XG5cbiAgICAgICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93LCB0aGlzLmxpYnJhcnlOYW1lKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWl4cGFuZWxJbnN0YW5jZSA9IGNyZWF0ZU1peHBhbmVsRGVsZWdhdG9yKCR3aW5kb3cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihkaXNhYmxlZCl7XG4gICAgICAgIC8vIENyZWF0ZSBhIG1vY2sgKG5vb3ApIGluc3RhbmNlIG9mIHRoZSBtaXhwYW5lbCBBUElcbiAgICAgICAgbWl4cGFuZWxJbnN0YW5jZSA9IGNyZWF0ZU1peHBhbmVsRGVsZWdhdG9yKCR3aW5kb3csIHVuZGVmaW5lZCwgdHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGRpc2FibGVkRXZlbnRzKXtcbiAgICAgICAgbWl4cGFuZWxJbnN0YW5jZS5kaXNhYmxlKGRpc2FibGVkRXZlbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG1peHBhbmVsSW5zdGFuY2U7XG4gICAgfTtcbiAgfSk7Il19
(2)
});
