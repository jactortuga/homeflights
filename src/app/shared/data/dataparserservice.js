angular
  .module('HomeFlights.dataParser', [])
  .factory('dataParserService', ['$http', function($http){
    return {
      // Define function to retrieve and manipulate data from dataset through $http
      // TODO: split functionality in separate functions, optimise loops and store data accordingly
      getData: function() {
        return $http.get('./assets/dataset/home_office_air_travel_data_2011.csv')
          // Define success callback functionality to return data when promise resolved
          .then(function(response) {
            console.log('Success [Service]');
            console.log(response);

            // Define functionality variables, data content array and data header array
            var dataRaw 			= response.data;
            var dataArray 		= dataRaw.split(/\r\n|\n/);
            var dataHeader 		= dataArray[0].split(',');
            var dataFull      = [];
            var dataFinal     = {};

            // Split data content based on comma and push into array as single set of flight information
            for (var i = 0; i < dataArray.length; i++) {
              var individualTrip = dataArray[i].split(',');
              if (individualTrip.length === dataHeader.length) {
                for (var j = 0; j < dataHeader.length; j++) {
                  if(i === 0) {
                    var dataHeaderObject = {
                      type:	dataHeader[j],
                      recurrenceObject: {},
                      recurrenceArray:	[]
                    };
                    dataFull.push(dataHeaderObject);
                  } else {
                    if(!dataFull[j].recurrenceObject[individualTrip[j]]) {
                      dataFull[j].recurrenceObject[individualTrip[j]] = 0;
                    }
                    ++dataFull[j].recurrenceObject[individualTrip[j]];
                  }
                }
              }
            }

            for (var p = 0; p < dataFull.length; p++) {
              for (var key in dataFull[p].recurrenceObject) {
                if (dataFull[p].recurrenceObject.hasOwnProperty(key)) {
                  var recurrenceSubObject = {
                    key: key,
                    value: dataFull[p].recurrenceObject[key]
                  };
                  dataFull[p].recurrenceArray.push(recurrenceSubObject);
                  var dataType        = dataFull[p].type;
                  var dataRecurrence  = dataFull[p].recurrenceArray;
                  dataFinal[dataType] = dataRecurrence;
                }
              }
            }

            // Return final set of data
            console.log('DATA FINAL')
            console.log(dataFinal)
            return dataFinal;

          // Define error callback functionality to display error
          }, function errorCallback(error) {
            console.log('Error [Service]');
            console.log(error);
          });
      }
    };
  }]);
