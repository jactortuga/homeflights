angular.module('myApp.data', [])
.controller('dataCtrl',['$http', function($http){
	this.dataText = 'This is the data component!';

	this.tiles = buildGridModel({
            icon : "avatar:svg-",
            title: "Svg-",
            background: ""
          });

    function buildGridModel(tileTmpl){
      var it, results = [ ];

      for (var j=0; j<11; j++) {

        it = angular.extend({},tileTmpl);
        it.icon  = it.icon + (j+1);
        it.title = it.title + (j+1);
        it.span  = { row : 1, col : 1 };

        switch(j+1) {
          case 1:
            it.background = "red";
            it.span.row = it.span.col = 2;
            break;

          case 2: it.background = "green";         break;
          case 3: it.background = "darkBlue";      break;
          case 4:
            it.background = "blue";
            it.span.col = 2;
            break;

          case 5:
            it.background = "yellow";
            it.span.row = it.span.col = 2;
            break;

          case 6: it.background = "pink";          break;
          case 7: it.background = "darkBlue";      break;
          case 8: it.background = "purple";        break;
          case 9: it.background = "deepBlue";      break;
          case 10: it.background = "lightPurple";  break;
          case 11: it.background = "yellow";       break;
        }

        results.push(it);
      }
      return results;
    }

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
