!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self),n.angularMixpanel=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* Mixpanel dynamically rewrites it's object bound to the window upon loading
  from the CDN origin. This means that if a reference to the mixpanel object
  is acquired prior to the mixpanel script loading, it becomes stale. This
  factory creates an api which dispatches the call to the currnet mixpanel
  object bound to the window at call-time, ensuring the calls go to the right
  place.
*/
module.exports = function createMixpanelDelegator($window, instanceName) {
  function getMixpanelInstance() {
    if(!instanceName) return $window.mixpanel;
    return $window.mixpanel[instanceName];
  }

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
      var mixpanel = getMixpanelInstance();
      return mixpanel[methodName].apply(mixpanel, arguments);
    };
  });

  api.people = {};
  peopleMethods.forEach(function(methodName){
    api.people[methodName] = function(){
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
        mixpanelInstance.disable();
      } else if (disabledEvents){
        mixpanelInstance.disable(disabledEvents);
      }

      return mixpanelInstance;
    };
  });
},{"./createMixpanelDelegator":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvb3phbi9jb2RlL2JvaWxlcnBsYXRlLWd1bHAtYW5ndWxhci9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL296YW4vY29kZS9hbmd1bGFyLW1peHBhbmVsL3NyYy9jcmVhdGVNaXhwYW5lbERlbGVnYXRvci5qcyIsIi9Vc2Vycy9vemFuL2NvZGUvYW5ndWxhci1taXhwYW5lbC9zcmMvbW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIE1peHBhbmVsIGR5bmFtaWNhbGx5IHJld3JpdGVzIGl0J3Mgb2JqZWN0IGJvdW5kIHRvIHRoZSB3aW5kb3cgdXBvbiBsb2FkaW5nXG4gIGZyb20gdGhlIENETiBvcmlnaW4uIFRoaXMgbWVhbnMgdGhhdCBpZiBhIHJlZmVyZW5jZSB0byB0aGUgbWl4cGFuZWwgb2JqZWN0XG4gIGlzIGFjcXVpcmVkIHByaW9yIHRvIHRoZSBtaXhwYW5lbCBzY3JpcHQgbG9hZGluZywgaXQgYmVjb21lcyBzdGFsZS4gVGhpc1xuICBmYWN0b3J5IGNyZWF0ZXMgYW4gYXBpIHdoaWNoIGRpc3BhdGNoZXMgdGhlIGNhbGwgdG8gdGhlIGN1cnJuZXQgbWl4cGFuZWxcbiAgb2JqZWN0IGJvdW5kIHRvIHRoZSB3aW5kb3cgYXQgY2FsbC10aW1lLCBlbnN1cmluZyB0aGUgY2FsbHMgZ28gdG8gdGhlIHJpZ2h0XG4gIHBsYWNlLlxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdywgaW5zdGFuY2VOYW1lKSB7XG4gIGZ1bmN0aW9uIGdldE1peHBhbmVsSW5zdGFuY2UoKSB7XG4gICAgaWYoIWluc3RhbmNlTmFtZSkgcmV0dXJuICR3aW5kb3cubWl4cGFuZWw7XG4gICAgcmV0dXJuICR3aW5kb3cubWl4cGFuZWxbaW5zdGFuY2VOYW1lXTtcbiAgfVxuXG4gIHZhciBtZXRob2RzID0gW1xuICAgICdpbml0JyxcbiAgICAncHVzaCcsXG4gICAgJ2Rpc2FibGUnLFxuICAgICd0cmFjaycsXG4gICAgJ3RyYWNrX2xpbmtzJyxcbiAgICAndHJhY2tfZm9ybXMnLFxuICAgICdyZWdpc3RlcicsXG4gICAgJ3JlZ2lzdGVyX29uY2UnLFxuICAgICd1bnJlZ2lzdGVyJyxcbiAgICAnaWRlbnRpZnknLFxuICAgICdnZXRfZGlzdGluY3RfaWQnLFxuICAgICdhbGlhcycsXG4gICAgJ3NldF9jb25maWcnLFxuICAgICdnZXRfY29uZmlnJyxcbiAgICAnZ2V0X3Byb3BlcnR5J1xuICBdO1xuXG4gIHZhciBwZW9wbGVNZXRob2RzID0gW1xuICAgICdzZXQnLFxuICAgICdzZXRfb25jZScsXG4gICAgJ2luY3JlbWVudCcsXG4gICAgJ2FwcGVuZCcsXG4gICAgJ3RyYWNrX2NoYXJnZScsXG4gICAgJ2NsZWFyX2NoYXJnZXMnLFxuICAgICdkZWxldGVfdXNlcidcbiAgXTtcblxuICB2YXIgYXBpID0ge307XG4gIG1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcbiAgICBhcGlbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtaXhwYW5lbCA9IGdldE1peHBhbmVsSW5zdGFuY2UoKTtcbiAgICAgIHJldHVybiBtaXhwYW5lbFttZXRob2ROYW1lXS5hcHBseShtaXhwYW5lbCwgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICBhcGkucGVvcGxlID0ge307XG4gIHBlb3BsZU1ldGhvZHMuZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKXtcbiAgICBhcGkucGVvcGxlW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBtaXhwYW5lbCA9IGdldE1peHBhbmVsSW5zdGFuY2UoKTtcbiAgICAgIHJldHVybiBtaXhwYW5lbC5wZW9wbGVbbWV0aG9kTmFtZV0uYXBwbHkobWl4cGFuZWwucGVvcGxlLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBhcGk7XG59OyIsIid1c2Ugc3RyaWN0Jztcbi8qIGdsb2JhbCBhbmd1bGFyICovXG5cbnZhciBjcmVhdGVNaXhwYW5lbERlbGVnYXRvciA9IHJlcXVpcmUoJy4vY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3InKTtcblxuYW5ndWxhci5tb2R1bGUoJ2FuYWx5dGljcy5taXhwYW5lbCcsIFtdKVxuICAuZGlyZWN0aXZlKCdtaXhwYW5lbFRyYWNrQ2xpY2snLCBmdW5jdGlvbihtaXhwYW5lbCkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0EnLFxuICAgICAgc2NvcGU6IHtcbiAgICAgICAgJ21peHBhbmVsUHJvcGVydGllcyc6ICc9J1xuICAgICAgfSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyKSB7XG4gICAgICAgIGVsZW1lbnQub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGV2ZW50TmFtZSA9IGF0dHIubWl4cGFuZWxUcmFja0NsaWNrIHx8XG4gICAgICAgICAgICBlbGVtZW50LnZhbCgpIHx8XG4gICAgICAgICAgICBlbGVtZW50LnRleHQoKSxcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSBzY29wZS5taXhwYW5lbFByb3BlcnRpZXM7XG5cbiAgICAgICAgICBtaXhwYW5lbC50cmFjayhldmVudE5hbWUsIHByb3BlcnRpZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuICAucHJvdmlkZXIoJ21peHBhbmVsJywgZnVuY3Rpb24oKSB7XG4gICAgdmFyIG1peHBhbmVsSW5zdGFuY2UsIGRpc2FibGVkRXZlbnRzLCBkaXNhYmxlZDtcblxuICAgIC8vIEFsbG93IHRoZSBleHBsaWNpdCBwYXNzaW5nIGluIG9mIGEgbWl4cGFuZWwgb2JqZWN0XG4gICAgdGhpcy5taXhwYW5lbCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBtaXhwYW5lbEluc3RhbmNlID0gdmFsdWU7XG4gICAgfTtcblxuICAgIHRoaXMudG9rZW4gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLmxpYnJhcnlOYW1lID0gJ2FuZ3VsYXInO1xuXG4gICAgLy8gRW5hYmxlcyBtdWx0aXBsZSBjYWxscyB0byBkaXNhYmxlIGV2ZW50cyB3aGljaCB3aWxsIGJlIGNvbGxlY3RlZCB0aGVuXG4gICAgLy8gYXBwbGllZCBkdXJpbmcgaW5pdGlhbGl6YXRpb24uIElmIGRpc2FibGUgaXMgY2FsbGVkLCB0aGVuIGl0IG92ZXJyaWRlc1xuICAgIC8vIGFsbCBpbmRpdmlkdWFsIGV2ZW50IGRpc2FibGluZy5cbiAgICB0aGlzLmRpc2FibGUgPSBmdW5jdGlvbihldmVudHMpIHtcbiAgICAgIGlmKGFuZ3VsYXIuaXNBcnJheShldmVudHMpKXtcbiAgICAgICAgaWYoIWRpc2FibGVkRXZlbnRzKSBkaXNhYmxlZEV2ZW50cyA9IFtdO1xuICAgICAgICBkaXNhYmxlZEV2ZW50cyA9IGRpc2FibGVkRXZlbnRzLmNvbmNhdChldmVudHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLiRnZXQgPSBmdW5jdGlvbigkd2luZG93KSB7XG4gICAgICAvLyBJZiBubyBtaXhwYW5lbCBpbnN0YW5jZSB3YXMgcGFzc2VkIGludG8gdGhpcyBwcm92aWRlciwgdGhlblxuICAgICAgLy8gd2UnbGwgY3JlYXRlIGEgbmV3IGluc3RhbmNlIGZyb20gdGhlIGdsb2JhbCBtaXhwYW5lbCBvYmplY3QuXG4gICAgICAvLyBUaGlzIGVuc3VyZXMgd2UgZG9uJ3Qgb3ZlcndyaXRlIGV4aXN0aW5nIG1peHBhbmVsIGRlcGxveW1lbnRzLlxuICAgICAgaWYgKCFtaXhwYW5lbEluc3RhbmNlKSB7IFxuICAgICAgICBpZiAoISR3aW5kb3cubWl4cGFuZWwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIG1peHBhbmVsLCBpcyB0aGUgdGFnICcgK1xuICAgICAgICAgICAgJ2luY2x1ZGVkIGluIHRoZSBwYWdlPycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gdG9rZW4gaXMgcGFzc2VkLCB1c2UgdGhlIGV4aXN0aW5nIGdsb2JhbCBtaXhwYW5lbCBpbnN0YW5jZVxuICAgICAgICBpZiAodGhpcy50b2tlbikge1xuICAgICAgICAgIC8vIElmIGEgdG9rZW4gaXMgcGFzc2VkLCB0aGVuIGNyZWF0ZSBhIG5ldyBtaXhwYW5lbCBpbnN0ZWFuY2VcbiAgICAgICAgICAvLyBhbmQgcGFzcyB0aGUgaGFuZGxlciBmb3IgaXQuXG4gICAgICAgICAgJHdpbmRvdy5taXhwYW5lbC5pbml0KHRoaXMudG9rZW4sIHRoaXMuY29uZmlnLCB0aGlzLmxpYnJhcnlOYW1lKTtcblxuICAgICAgICAgIG1peHBhbmVsSW5zdGFuY2UgPSBjcmVhdGVNaXhwYW5lbERlbGVnYXRvcigkd2luZG93LCB0aGlzLmxpYnJhcnlOYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtaXhwYW5lbEluc3RhbmNlID0gY3JlYXRlTWl4cGFuZWxEZWxlZ2F0b3IoJHdpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYoZGlzYWJsZWQpe1xuICAgICAgICBtaXhwYW5lbEluc3RhbmNlLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSBpZiAoZGlzYWJsZWRFdmVudHMpe1xuICAgICAgICBtaXhwYW5lbEluc3RhbmNlLmRpc2FibGUoZGlzYWJsZWRFdmVudHMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbWl4cGFuZWxJbnN0YW5jZTtcbiAgICB9O1xuICB9KTsiXX0=
(2)
});
