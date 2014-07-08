'use strict';
/* global inject, angular, jasmine */

var $module = angular.mock.module;

describe('analytics.mixpanel', function() {
  var $window,
    provider;

  function initHelpers() {
    $window = {
      mixpanel: {
        init: jasmine.createSpy(),
        track: jasmine.createSpy(),
        disable: jasmine.createSpy(),
        people: {
          set: jasmine.createSpy()
        }
      }
    };

    $module(function($provide, mixpanelProvider) {
      $provide.value('$window', $window);
      provider = mixpanelProvider;
    });

    inject(function() {}); // Forces evalutation for $module
  }

  describe('method delegation', function(){
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('delegates calls to the current mixpanel object', function(){
      var mixpanel = provider.$get($window);
      var oldMixpanelInstance = $window.mixpanel;

      // Overwrite the global reference to mixpanel.
      $window.mixpanel = {
        track: jasmine.createSpy()
      };

      mixpanel.track('event');

      expect(oldMixpanelInstance.track).not.toHaveBeenCalled();
      expect($window.mixpanel.track).toHaveBeenCalledWith('event');
    });
  });

  describe('disabling', function(){
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('can disable individual events', function(){
      provider.disable(['test']);
      provider.$get($window);
      
      expect($window.mixpanel.disable).toHaveBeenCalledWith(['test']);
    });

    it('can collect multiple calls to disable individual events', function(){
      provider.disable(['test1']);
      provider.disable(['test2']);
      provider.$get($window);
      
      expect($window.mixpanel.disable).toHaveBeenCalledWith(['test1', 'test2']);
    });

    it('can disable all events', function(){
      provider.disable();
      var mixpanel = provider.$get($window);
      
      mixpanel.track('event');
      mixpanel.people.set('name', 'bob');
      expect($window.mixpanel.track).not.toHaveBeenCalled();
      expect($window.mixpanel.people.set).not.toHaveBeenCalled();
    });

    it('prefers disabling all events rather than individual events', function(){
      provider.disable(['test']);
      provider.disable();
      var mixpanel = provider.$get($window);
      
      mixpanel.track('event');
      mixpanel.people.set('name', 'bob');
      expect($window.mixpanel.track).not.toHaveBeenCalled();
      expect($window.mixpanel.people.set).not.toHaveBeenCalled();
    });
  });

  describe('when a mixpanel instance already exists', function() {
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('can be passed explicitly during configuration', function() {
      var mixpanelInstance = {
        track: jasmine.createSpy()
      };
      provider.mixpanel(mixpanelInstance);

      var mixpanel = provider.$get($window);
      mixpanel.track('event');
      expect($window.mixpanel.init).not.toHaveBeenCalled();
      expect($window.mixpanel.track).not.toHaveBeenCalled();
      expect(mixpanelInstance.track).toHaveBeenCalledWith('event');
    });
  });

  describe('when a mixpanel instance doesn\'t exist', function() {
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('returns the global instance if no token is provided', function() {
      var result = provider.$get($window);
      result.track('event');
      expect($window.mixpanel.track).toHaveBeenCalledWith('event');
    });

    it('returns a new instance if a token is provided', function() {
      provider.token = 'abc';
      provider.$get($window);
      expect($window.mixpanel.init).toHaveBeenCalled();
    });

    it('fails startup if no mixpanel exists in the window', function() {
      expect(function() {
        provider.$get({});
      }).toThrow();
    });
  });
});