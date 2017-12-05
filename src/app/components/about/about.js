angular
  .module('HomeFlights.about', [])
  .controller('aboutCtrl',[function(){
    this.title              = 'About';
    this.descriptionProject = 'HomeFlights is an ongoing digital project that aims at easing the task of tracking flights information and expenses of the UK Home Office and its agencies through data visualisation. The goal is ultimately to make large amounts of data more understandable through different types of interactive charts and graphs.';
    this.descriptionData    = 'The data presented on this site relates to 2011. It has been published by UK Home Office and it is licensed under Open Government Licence.';
    this.descriptionInfo    = 'The site has been built using AngularJS, AngularJS Material, D3 and SCSS.';
  }]);
