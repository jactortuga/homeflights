angular.module('myApp.data', [])
.controller('dataCtrl',['$http', function($http){
	this.dataText = 'This is the data component!';

	// $http({
	// 	method: 'GET',
	// 	url: './assets/dataset/home_office_air_travel_data_2011.csv'
	// }).then(function successCallback(response) {
	// 	console.log('good')
  //
	// 	// this callback will be called asynchronously
	// 	// when the response is available
	// 	// split content based on new line
	// 	var allText = response.data;
	// 	var allTextLines = allText.split(/\r\n|\n/);
	// 	var headers = allTextLines[0].split(',');
	// 	var lines = [];
  //
	// 	for ( var i = 0; i < allTextLines.length; i++) {
	// 			// split content based on comma
	// 			var data = allTextLines[i].split(',');
	// 			if (data.length == headers.length) {
	// 					var tarr = [];
	// 					for ( var j = 0; j < headers.length; j++) {
	// 							tarr.push(data[j]);
	// 					}
	// 					lines.push(tarr);
	// 			}
	// 	}
	// 	console.log(lines)
	// }, function errorCallback(response) {
	// 	// called asynchronously if an error occurs
	// 	// or server returns response with an error status.
	// 	console.log('error')
	// });

}]);
