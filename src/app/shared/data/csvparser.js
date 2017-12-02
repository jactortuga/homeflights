angular.module('myApp.csvParser')
  .factory('Items', ['$http', function($http){
    var Url   = './dataset/home_office_air_travel_data_2011.csv';
    var Items = $http.get(Url).then(function(response){
      return csvParser(response.data);
    });
    return Items;
  }]);
