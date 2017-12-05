angular
  .module('myApp.home', [])
  .controller('homeCtrl',[function(){
    this.title 				= 'HomeFlights';
    this.description 	= 'Keeping track of flight data for the UK Home Office and its agencies through visualisation';
    this.action 			= 'Explore';
    this.credits 			= 'Built by JP using AngularJS, AngularJS Material, D3 and SCSS';
  }]);
