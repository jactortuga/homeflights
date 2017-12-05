angular
.module('myApp.data', [])
.controller('dataCtrl',['$http', '$scope', function($http, $scope) {
  this.dataText = 'This is the data component!';
  this.d3BarClick = function(item) {
    console.log('console.click');
    console.log(item);
		// $scope.$apply(function() {
		// 	if (!$scope.showDetailPanel)
		// 	$scope.showDetailPanel = true;
		// 	$scope.detailItem = item;
		// });
  };

  // this.d3Data = [
	// 	{name: 'Greg', score: 98},
	// 	{name: 'Ari', score: 96},
	// 	{name: 'Q', score: 75},
	// 	{name: 'Loser', score: 48}
  // ];

	// this callback will be called asynchronously
	// when the response is available
	// split content based on new line
  $http({
    method: 'GET',
    url: './assets/dataset/home_office_air_travel_data_2011.csv'
  }).then(function successCallback(response) {
    console.log('Success');
    console.log(response);

		// Manipulating data
    var dataRaw 			= response.data;
    var dataArray 		= dataRaw.split(/\r\n|\n/);
    var dataHeader 		= dataArray[0].split(',');
    var dataClean 		= [];
		// console.log(dataRaw);
		// console.log(dataArray);
		// console.log(dataHeader);

		// split content based on comma
    for (var i = 1; i < dataArray.length; i++) {
      var data = dataArray[i].split(',');
      if (data.length === dataHeader.length) {
        var tarr = [];
        for (var j = 0; j < dataHeader.length; j++) {
          tarr.push(data[j]);
        }
        dataClean.push(tarr);
      }
    }

		var finalArray = [];
		for (var i = 0; i < dataHeader.length; i++) {
			var newObject = {
				type:	dataHeader[i],
				data:	[],
			};
			finalArray.push(newObject)
		}

		var months = [];

		// console.log(finalArray)
		for (var i = 0; i < dataClean.length; i++) {
			for (var j = 0; j < dataClean[i].length; j++) {
					finalArray[j].data.push(dataClean[i][j])
			}
		}

		// console.log(finalArray)
		for (var i = 0; i < finalArray.length; i++) {
			finalArray[i].recurrence = {}
			finalArray[i].final = []
			for(var j = 0; j < finalArray[i].data.length; ++j) {
					if(!finalArray[i].recurrence[finalArray[i].data[j]]) {
						finalArray[i].recurrence[finalArray[i].data[j]] = 0;
					}
					++finalArray[i].recurrence[finalArray[i].data[j]];
			}
			//finalArray[i].final.push(finalArray[i].recurrence[finalArray[i].data[j]])
		}
		console.log('SOMETHING HERE')
		console.log(finalArray)
		console.log(finalArray[0].recurrence)
		// var banana = Object.keys(finalArray[0].recurrence).map(key => {
		// 	console.log(finalArray[0].recurrence)
		// 	console.log(finalArray[0].recurrence[key])
		// 	return finalArray[0].recurrence[key];
		// })
		var obj = finalArray[0].recurrence;
		var arr = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				console.log(key)
				var newObject = {
					name: key,
					score: obj[key]
				}
				arr.push(newObject);
			}
		};
		var result = arr;
		console.log('******************')
		console.log(result)
		console.log(Object.keys(finalArray[0].recurrence))
		console.log(Object.values(finalArray[0].recurrence))

		$scope.d3Data = arr;
  }, function errorCallback(error) {
    console.log('Error');
    console.log(error);
  });

}]);
