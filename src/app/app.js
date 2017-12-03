require('angular');
require('angular-ui-router');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('./components/home/home.js');
require('./components/data/data.js');
require('./shared/header/header.js');
require('./shared/d3/d3service.js');
require('./shared/d3/d3directives.js');

var app = angular.module('myApp', ['ui.router','ngMaterial','myApp.home','myApp.data', 'myApp.header', 'myApp.d3Directives']);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('home', {
		url: '/',
		views: {
			'' : {
				templateUrl: 'app/components/home/home.html'
			},
			'header@home': {
				templateUrl: 'app/shared/header/header.html'
			}
		}
	})

	.state('data', {
    url: '/data',
		views: {
			'': {
				templateUrl: 'app/components/data/data.html'
			},
			'header@data': {
				templateUrl: 'app/shared/header/header.html'
			}
		}
  });
});
