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

            // Loop through data array of individual flights information strings
            for (var i = 0; i < dataArray.length; i++) {
              // Split individual flight information string into array to access and store values
              var individualTrip = dataArray[i].split(',');
              // Check for new individual flight information array length against data headers to avoid corrupted data
              if (individualTrip.length === dataHeader.length) {
                // Within each individual flight information array, loop through it to access individual values
                for (var j = 0; j < dataHeader.length; j++) {
                  // First array represents data header, thus create working object and push into working array
                  if(i === 0) {
                    var dataHeaderObject = {
                      type:	dataHeader[j],
                      recurrenceObject: {},
                      recurrenceArray: []
                    };
                    dataFull.push(dataHeaderObject);
                  // For remaining arrays, check recurrence and set value in recurrence object within working array
                  } else {
                    if(!dataFull[j].recurrenceObject[individualTrip[j]]) {
                      dataFull[j].recurrenceObject[individualTrip[j]] = 0;
                    }
                    ++dataFull[j].recurrenceObject[individualTrip[j]];
                  }
                }
              }
            }

            // Loop through working array to get recurrence values and define final array in desired format
            for (var p = 0; p < dataFull.length; p++) {
              // Loop through recurrence object to get recurrence name and score
              for (var key in dataFull[p].recurrenceObject) {
                if (dataFull[p].recurrenceObject.hasOwnProperty(key)) {
                  // Push selected key and value in recurrence array
                  var recurrenceSubObject = {
                    key: key,
                    value: dataFull[p].recurrenceObject[key]
                  };
                  dataFull[p].recurrenceArray.push(recurrenceSubObject);
                  // Get array element type value and recurrence array and push them into final array
                  var dataType        = dataFull[p].type;
                  var dataRecurrence  = dataFull[p].recurrenceArray;
                  dataFinal[dataType] = dataRecurrence;
                }
              }
            }

            // Return final set of data in selected format for easier manipulation and d3 access
            return dataFinal;

          // Define error callback functionality to display error
          }, function errorCallback(error) {
            console.log('Error [Service]');
            console.log(error);
          }
        );
      }
    };
  }]);
