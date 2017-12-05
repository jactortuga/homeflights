angular
.module('HomeFlights.dataParser', [])
.factory('dataParserService', ['$http', function($http){
  return {
    getData: function() {
      return $http.get('./assets/dataset/home_office_air_travel_data_2011.csv')
        .then(function(response) {
          console.log('Success [Service]');
          console.log(response);
          //return data when promise resolved
          //that would help you to continue promise chain.

          var dataRaw 			= response.data;
          var dataArray 		= dataRaw.split(/\r\n|\n/);
          var dataHeader 		= dataArray[0].split(',');
          var dataClean 		= [];
          var dataFull      = [];
          var dataFinal     = {};

          // split content based on comma
          for (var i = 1; i < dataArray.length; i++) {
            var data = dataArray[i].split(',');
            if (data.length === dataHeader.length) {
              var subArray = [];
              for (var j = 0; j < dataHeader.length; j++) {
                subArray.push(data[j]);
              }
              dataClean.push(subArray);
            }
          }

          for (var k = 0; k < dataHeader.length; k++) {
            var headerObject = {
              type:	dataHeader[k],
              data:	[],
              recurrence: []
            };
            dataFull.push(headerObject);
          }

          for (var l = 0; l < dataClean.length; l++) {
            for (var m = 0; m < dataClean[l].length; m++) {
              dataFull[m].data.push(dataClean[l][m]);
            }
          }

          for (var n = 0; n < dataFull.length; n++) {
            var recurrenceTempObject = {};
            for(var o = 0; o < dataFull[n].data.length; ++o) {
              if(!recurrenceTempObject[dataFull[n].data[o]]) {
                recurrenceTempObject[dataFull[n].data[o]] = 0;
              }
              ++recurrenceTempObject[dataFull[n].data[o]];
            }

            for (var key in recurrenceTempObject) {
              if (recurrenceTempObject.hasOwnProperty(key)) {
                var recurrenceSubObject = {
                  key: key,
                  value: recurrenceTempObject[key]
                };
                dataFull[n].recurrence.push(recurrenceSubObject);
              }
            }
          }

          for (var p = 0; p < dataFull.length; p++) {
            var dataType        = dataFull[p].type;
            var dataRecurrence  = dataFull[p].recurrence;
            dataFinal[dataType] = dataRecurrence;
          }

          return dataFinal;
        }, function errorCallback(error) {
          console.log('Error [Service]');
          console.log(error);
        });
    }
  };
}]);
