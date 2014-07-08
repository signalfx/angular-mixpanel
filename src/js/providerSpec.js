'use strict';
/* global inject, angular, jasmine */

var $module = angular.mock.module;

describe('analytics.mixpanel', function() {
  var $window,
    provider;

  function initHelpers() {
    var initSpy = jasmine.createSpy();

    $window = {
      mixpanel: {
        init: initSpy
      }
    };
    $module(function($provide, mixpanelProvider) {
      $provide.value('$window', $window);
      provider = mixpanelProvider;
    });

    inject(function() {}); // Forces evalutation for $module
  }

  describe('when a mixpanel instance already exists', function() {
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('can be passed explicitly during configuration', function() {
      var mixpanelInstance = {
        init: jasmine.createSpy()
      };
      provider.mixpanel(mixpanelInstance);

      var mixpanel = provider.$get($window);

      expect($window.mixpanel.init).not.toHaveBeenCalled();
      expect(mixpanel).toBe(mixpanelInstance);
    });
  });

  describe('when a mixpanel instance doesn\'t exist', function() {
    beforeEach($module('analytics.mixpanel'));
    beforeEach(initHelpers);

    it('returns the global instance if no token is provided', function() {
      var result = provider.$get($window);
      expect(result).toBe($window.mixpanel);
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