angular
.module('myApp.data', [])
.controller('dataCtrl',['dataParserService', '$scope', function(dataParserService, $scope) {
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

  var getParsedData = dataParserService.getData();
  getParsedData.then(function(data) {
		console.log(data.Departure_2011)
		$scope.d3Data = data.Departure_2011;
	})

  // this.d3Data = [
	// 	{name: 'Greg', score: 98},
	// 	{name: 'Ari', score: 96},
	// 	{name: 'Q', score: 75},
	// 	{name: 'Loser', score: 48}
  // ];
}]);
