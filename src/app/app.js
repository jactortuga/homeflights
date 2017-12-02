require('angular');
require('angular-ui-router');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('./components/home/home.js');
require('./components/data/data.js');
require('./shared/visualisation/barschart.js');

var app = angular.module('myApp', ['ui.router','ngMaterial','myApp.home','myApp.data','myApp.barsChart']);

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
