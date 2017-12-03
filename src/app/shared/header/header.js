angular.module('myApp.header', [])

.controller('headerCtrl',['$location', '$window', function($location, $window){
  var githubLink      = 'https://github.com/jactortuga/homeflights';
  var currentPath     = $location.path();

  this.isDataView     = currentPath === '/data' ? true : false;
  this.openGithubLink = function() {
    $window.open(githubLink, '_blank');
  };
}]);
