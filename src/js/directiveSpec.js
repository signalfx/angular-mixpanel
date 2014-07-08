'use strict';
/* global inject, angular, jasmine */

var $module = angular.mock.module;

describe('analytics.mixpanel', function() {
  var mockMixpanel;

  beforeEach($module('analytics.mixpanel'));
  beforeEach(function() {
    mockMixpanel = {
      track: jasmine.createSpy()
    };

    $module(function($provide) {
      $provide.value('mixpanel', mockMixpanel);
    });
  });

  it('propogates track events', inject(function($compile, $rootScope) {
    var element = $compile('' +
      '<a href="#" mixpanel-track-click="popcorn">' +
      'Checkout' +
      '</a>'
    )($rootScope);

    $rootScope.$digest();

    element.triggerHandler('click');

    expect(mockMixpanel.track).toHaveBeenCalledWith('popcorn', undefined);
  }));


  it('falls back to innerText if no event name is passed',

    inject(function($compile, $rootScope) {
      var element = $compile('' +
        '<a href="#" mixpanel-track-click>' +
        'Checkout' +
        '</a>'
      )($rootScope);

      $rootScope.$digest();

      element.triggerHandler('click');

      expect(mockMixpanel.track).toHaveBeenCalledWith('Checkout', undefined);
    }));

  it('falls back to value for inputs if no event name is found',

    inject(function($compile, $rootScope) {
      var element = $compile('' +
        '<input type="button" value="Submit" mixpanel-track-click/>'
      )($rootScope);

      $rootScope.$digest();

      element.triggerHandler('click');

      expect(mockMixpanel.track).toHaveBeenCalledWith('Submit', undefined);
    }));

  it('passes an optional mixpanel properties object with events',
    inject(function($compile, $rootScope) {

      var element = $compile('' +
        '<a href="#" mixpanel-track-click="popcorn" ' + 
        ' mixpanel-properties="{a:1}">' +
          'Checkout' +
        '</a>'
      )($rootScope);

      $rootScope.$digest();

      element.triggerHandler('click');

      expect(mockMixpanel.track).toHaveBeenCalledWith('popcorn', {
        a: 1
      });
    }));
});