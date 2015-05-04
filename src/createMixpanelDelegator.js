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
