# Mixpanel for Angular
(not from the Mixpanel or Angular team)

A thin wrapper for including Mixpanel into Angular applications. 

## Use
Include the [Mixpanel snippet](https://mixpanel.com/help/reference/javascript)
on your page as usual. Then add this module to your scripts bundle, declare
your dependency to `analytics.mixpanel` and then you'll be inject the `mixpanel`
service whereever you please. Here's an example:

```javascript
angular.module('myApp', ['analytics.mixpanel'])
	.run(function(mixpanel){
		mixpanel.track('Loaded app');
	})
	.controller('myController', function(mixpanel){
		mixpanel.track('Clicked Ad', { "Banner Color": "Blue" });
	});
```

## Configuration
No configuration is required by default, but for advanced usecases it may be
useful.

By default, the service will pick up and use the global mixpanel object. However
if you want to isolate the angular mixpanel instance from the global one, you
can do so by configuring the `token` property of the provider, like so:

```javascript
angular.module('myApp', ['analytics.mixpanel'])
	.config(function(mixpanelProvider){
		// The Mixpanel API token.
		mixpanelProvider.token = 'my token';

		// Optional. A Mixpanel init config object.
		mixpanelProvider.config = {};
		
		// Optional. A namespace for mixpane instances, "angular" by default.
		mixpanelProvider.libraryName = 'My Library';
	});
```