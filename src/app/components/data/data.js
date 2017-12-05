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

  $scope.d3Data = {};

  var getParsedData = dataParserService.getData();
  getParsedData.then(function(data) {
    console.log('Success [Controller]');
    console.log(data);

    $scope.d3Data = {
      departureMonths: data.Departure_2011,
      departureLocations: data.Departure,
      arrivalLocations: data.Destination,
      directorate: data.Directorate.filter(function(obj) {
        return obj.score >= 100;
      }),
      airlines: data.Supplier_name.filter(function(obj) {
        return obj.score >= 100;
      }),
      farePrices: data.Paid_fare,
      ticketClasses: data.Ticket_class_description
    };
  });
}]);
