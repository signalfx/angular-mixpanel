!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularMixpanel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* Mixpanel dynamically rewrites it's object bound to the window upon loading
  from the CDN origin. This means that if a reference to the mixpanel object
  is acquired prior to the mixpanel script loading, it becomes stale. This
  factory creates an api which dispatches the call to the currnet mixpanel
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

    this.$get = function($window) {
      // If no mixpanel instance was passed into this provider, then
      // we'll create a new instance from the global mixpanel object.
      // This ensures we don't overwrite existing mixpanel deployments.
      if (!mixpanelInstance) { 
        if (!$window.mixpanel) {
          throw new Error('Unable to find mixpanel, is the tag ' +
            'included in the page?');
        }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvb3phbi9jb2RlL2JvaWxlcnBsYXRlLWd1bHAtYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9jcmVhdGVNaXhwYW5lbERlbGVnYXRvci5qcyIsIi9Vc2Vycy9vemFuL2NvZGUvYW5ndWxhci1taXhwYW5lbC9zcmMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogTWl4cGFuZWwgZHluYW1pY2FsbHkgcmV3cml0ZXMgaXQncyBvYmplY3QgYm91bmQgdG8gdGhlIHdpbmRvdyB1cG9uIGxvYWRpbmdcbiAgZnJvbSB0aGUgQ0ROIG9yaWdpbi4gVGhpcyBtZWFucyB0aGF0IGlmIGEgcmVmZXJlbmNlIHRvIHRoZSBtaXhwYW5lbCBvYmplY3RcbiAgaXMgYWNxdWlyZWQgcHJpb3IgdG8gdGhlIG1peHBhbmVsIHNjcmlwdCBsb2FkaW5nLCBpdCBiZWNvbWVzIHN0YWxlLiBUaGlzXG4gIGZhY3RvcnkgY3JlYXRlcyBhbiBhcGkgd2hpY2ggZGlzcGF0Y2hlcyB0aGUgY2FsbCB0byB0aGUgY3Vycm5ldCBtaXhwYW5lbFxuICBvYmplY3QgYm91bmQgdG8gdGhlIHdpbmRvdyBhdCBjYWxsLXRpbWUsIGVuc3VyaW5nIHRoZSBjYWxscyBnbyB0byB0aGUgcmlnaHRcbiAgcGxhY2UuXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHdpbmRvdywgaW5zdGFuY2VOYW1lLCBkaXNhYmxlZCkge1xuICBmdW5jdGlvbiBnZXRNaXhwYW5lbEluc3RhbmNlKCkge1xuICAgIGlmKCFpbnN0YW5jZU5hbWUpIHJldHVybiAkd2luZG93Lm1peHBhbmVsO1xuICAgIHJldHVybiAkd2luZG93Lm1peHBhbmVsW2luc3RhbmNlTmFtZV07XG4gIH1cblxuICBmdW5jdGlvbiBub29wKCl7fVxuXG4gIHZhciBtZXRob2RzID0gW1xuICAgICdpbml0JyxcbiAgICAncHVzaCcsXG4gICAgJ2Rpc2FibGUnLFxuICAgICd0cmFjaycsXG4gICAgJ3RyYWNrX2xpbmtzJyxcbiAgICAndHJhY2tfZm9ybXMnLFxuICAgICdyZWdpc3RlcicsXG4gICAgJ3JlZ2lzdGVyX29uY2UnLFxuICAgICd1bnJlZ2lzdGVyJyxcbiAgICAnaWRlbnRpZnknLFxuICAgICdnZXRfZGlzdGluY3RfaWQnLFxuICAgICdhbGlhcycsXG4gICAgJ3NldF9jb25maWcnLFxuICAgICdnZXRfY29uZmlnJyxcbiAgICAnZ2V0X3Byb3BlcnR5J1xuICBdO1xuXG4gIHZhciBwZW9wbGVNZXRob2RzID0gW1xuICAgICdzZXQnLFxuICAgICdzZXRfb25jZScsXG4gICAgJ2luY3JlbWVudCcsXG4gICAgJ2FwcGVuZCcsXG4gICAgJ3RyYWNrX2NoYXJnZScsXG4gICAgJ2NsZWFyX2NoYXJnZXMnLFxuICAgICdkZWxldGVfdXNlcidcbiAgXTtcblxuICB2YXIgYXBpID0ge307XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcbiAgICBhcGlbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmKGRpc2FibGVkKSByZXR1cm4gbm9vcDtcblxuICAgICAgdmFyIG1peHBhbmVsID0gZ2V0TWl4cGFuZWxJbnN0YW5jZSgpO1xuICAgICAgcmV0dXJuIG1peHBhbmVsW21ldGhvZE5hbWVdLmFwcGx5KG1peHBhbmVsLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIGFwaS5wZW9wbGUgPSB7fTtcbiAgcGVvcGxlTWV0aG9kcy5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZE5hbWUpe1xuICAgIGFwaS5wZW9wbGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpe1xuICAgICAgaWYoZGlzYWJsZWQpIHJldHVybiBub29wO1xuICAgICAgXG4gICAgICB2YXIgbWl4cGFuZWwgPSBnZXRNaXhwYW5lbEluc3RhbmNlKCk7XG4gICAgICByZXR1cm4gbWl4cGFuZWwucGVvcGxlW21ldGhvZE5hbWVdLmFwcGx5KG1peHBhbmVsLnBlb3BsZSwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gYXBpO1xufTsiLCIndXNlIHN0cmljdCc7XG4vKiBnbG9iYWwgYW5ndWxhciAqL1xuXG52YXIgY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IgPSByZXF1aXJlKCcuL2NyZWF0ZU1peHBhbmVsRGVsZWdhdG9yJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCdhbmFseXRpY3MubWl4cGFuZWwnLCBbXSlcbiAgLmRpcmVjdGl2ZSgnbWl4cGFuZWxUcmFja0NsaWNrJywgZnVuY3Rpb24obWl4cGFuZWwpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHNjb3BlOiB7XG4gICAgICAgICdtaXhwYW5lbFByb3BlcnRpZXMnOiAnPSdcbiAgICAgIH0sXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cikge1xuICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBldmVudE5hbWUgPSBhdHRyLm1peHBhbmVsVHJhY2tDbGljayB8fFxuICAgICAgICAgICAgZWxlbWVudC52YWwoKSB8fFxuICAgICAgICAgICAgZWxlbWVudC50ZXh0KCksXG4gICAgICAgICAgICBwcm9wZXJ0aWVzID0gc2NvcGUubWl4cGFuZWxQcm9wZXJ0aWVzO1xuXG4gICAgICAgICAgbWl4cGFuZWwudHJhY2soZXZlbnROYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcbiAgLnByb3ZpZGVyKCdtaXhwYW5lbCcsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBtaXhwYW5lbEluc3RhbmNlLCBkaXNhYmxlZEV2ZW50cywgZGlzYWJsZWQ7XG5cbiAgICAvLyBBbGxvdyB0aGUgZXhwbGljaXQgcGFzc2luZyBpbiBvZiBhIG1peHBhbmVsIG9iamVjdFxuICAgIHRoaXMubWl4cGFuZWwgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgbWl4cGFuZWxJbnN0YW5jZSA9IHZhbHVlO1xuICAgIH07XG5cbiAgICB0aGlzLnRva2VuID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgdGhpcy5saWJyYXJ5TmFtZSA9ICdhbmd1bGFyJztcblxuICAgIC8vIEVuYWJsZXMgbXVsdGlwbGUgY2FsbHMgdG8gZGlzYWJsZSBldmVudHMgd2hpY2ggd2lsbCBiZSBjb2xsZWN0ZWQgdGhlblxuICAgIC8vIGFwcGxpZWQgZHVyaW5nIGluaXRpYWxpemF0aW9uLiBJZiBkaXNhYmxlIGlzIGNhbGxlZCwgdGhlbiBpdCBvdmVycmlkZXNcbiAgICAvLyBhbGwgaW5kaXZpZHVhbCBldmVudCBkaXNhYmxpbmcuXG4gICAgdGhpcy5kaXNhYmxlID0gZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgICBpZihhbmd1bGFyLmlzQXJyYXkoZXZlbnRzKSl7XG4gICAgICAgIGlmKCFkaXNhYmxlZEV2ZW50cykgZGlzYWJsZWRFdmVudHMgPSBbXTtcbiAgICAgICAgZGlzYWJsZWRFdmVudHMgPSBkaXNhYmxlZEV2ZW50cy5jb25jYXQoZXZlbnRzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24oJHdpbmRvdykge1xuICAgICAgLy8gSWYgbm8gbWl4cGFuZWwgaW5zdGFuY2Ugd2FzIHBhc3NlZCBpbnRvIHRoaXMgcHJvdmlkZXIsIHRoZW5cbiAgICAgIC8vIHdlJ2xsIGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBmcm9tIHRoZSBnbG9iYWwgbWl4cGFuZWwgb2JqZWN0LlxuICAgICAgLy8gVGhpcyBlbnN1cmVzIHdlIGRvbid0IG92ZXJ3cml0ZSBleGlzdGluZyBtaXhwYW5lbCBkZXBsb3ltZW50cy5cbiAgICAgIGlmICghbWl4cGFuZWxJbnN0YW5jZSkgeyBcbiAgICAgICAgaWYgKCEkd2luZG93Lm1peHBhbmVsKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZmluZCBtaXhwYW5lbCwgaXMgdGhlIHRhZyAnICtcbiAgICAgICAgICAgICdpbmNsdWRlZCBpbiB0aGUgcGFnZT8nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIG5vIHRva2VuIGlzIHBhc3NlZCwgdXNlIHRoZSBleGlzdGluZyBnbG9iYWwgbWl4cGFuZWwgaW5zdGFuY2VcbiAgICAgICAgaWYgKHRoaXMudG9rZW4pIHtcbiAgICAgICAgICAvLyBJZiBhIHRva2VuIGlzIHBhc3NlZCwgdGhlbiBjcmVhdGUgYSBuZXcgbWl4cGFuZWwgaW5zdGVhbmNlXG4gICAgICAgICAgLy8gYW5kIHBhc3MgdGhlIGhhbmRsZXIgZm9yIGl0LlxuICAgICAgICAgICR3aW5kb3cubWl4cGFuZWwuaW5pdCh0aGlzLnRva2VuLCB0aGlzLmNvbmZpZywgdGhpcy5saWJyYXJ5TmFtZSk7XG5cbiAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdywgdGhpcy5saWJyYXJ5TmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWl4cGFuZWxJbnN0YW5jZSA9IGNyZWF0ZU1peHBhbmVsRGVsZWdhdG9yKCR3aW5kb3cpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKGRpc2FibGVkKXtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbW9jayAobm9vcCkgaW5zdGFuY2Ugb2YgdGhlIG1peHBhbmVsIEFQSVxuICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoZGlzYWJsZWRFdmVudHMpe1xuICAgICAgICBtaXhwYW5lbEluc3RhbmNlLmRpc2FibGUoZGlzYWJsZWRFdmVudHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWl4cGFuZWxJbnN0YW5jZTtcbiAgICB9O1xuICB9KTsiXX0=
(2)
});
