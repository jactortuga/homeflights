angular
  .module('HomeFlights.header', [])
  .controller('headerCtrl',['$location', '$window', function($location, $window){
    var githubLink      = 'https://github.com/jactortuga/homeflights';
    var currentPath     = $location.path();
    this.isDataView     = currentPath.indexOf('/data') !== -1 ? true : false;
    this.openGithubLink = function() {
      $window.open(githubLink, '_blank');
    };
  }]);
