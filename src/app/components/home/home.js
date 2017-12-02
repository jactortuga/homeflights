angular.module('myApp.home', [])

.controller('homeCtrl',[function(){
  this.title 				= 'HomeFlights';
  this.description 	= 'Visualising flight data for the UK Home Office and its agencies.';
  this.action 			= 'Explore';
}]);
