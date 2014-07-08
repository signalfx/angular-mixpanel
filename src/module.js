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