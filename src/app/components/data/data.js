angular
  .module('HomeFlights.data', [])
  .controller('dataCtrl',['dataParserService', '$scope', function(dataParserService, $scope) {

    $scope.d3Data = {};

    // Get data from service and inject into view
    // Filter out low value elements from selected returned objects
    var getParsedData = dataParserService.getData();
    getParsedData.then(function(data) {
      $scope.d3Data = {
        departureMonths: data.Departure_2011,
        departureLocations: data.Departure,
        arrivalLocations: data.Destination,
        directorate: data.Directorate.filter(function(obj) {
          return obj.value >= 100;
        }),
        airlines: data.Supplier_name.filter(function(obj) {
          return obj.value >= 20;
        }),
        ticketClasses: data.Ticket_class_description,
        farePrices: data.Paid_fare
      };
    });

    // TODO: Define 3d bar chart click functionality for filtering purposes
    this.d3BarClick = function(item) {
      console.log('Hello Panasser');
    };
  }]);
