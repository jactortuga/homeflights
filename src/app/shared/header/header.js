angular.module('myApp.header', [])
.controller('headerCtrl',['$location', function($location){
  console.log('HELLO!');
  var currentPath = $location.path();
  this.isDataView = currentPath === '/data' ? true : false;
  console.log(currentPath);
  console.log(this.isDataView);
}]);
