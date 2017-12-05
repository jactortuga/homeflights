// Using d3 with dependency injection
angular.module('d3', [])
  .factory('d3Service', ['$document', '$q', '$rootScope', function($document, $q, $rootScope) {

    // Define new instance of deferred object to perform action asynchronously
    var deferred = $q.defer();

    // Resolve promise with D3 library on script load and apply to root scope
    function onScriptLoad() {
      $rootScope.$apply(function() {
        deferred.resolve(window.d3);
      });
    }

    // Create JS script with d3.v4 as source and call resolve promise callback when loaded
    var scriptTag     = $document[0].createElement('script');
    scriptTag.type    = 'text/javascript';
    scriptTag.async   = true;
    scriptTag.src     = 'https://d3js.org/d3.v4.js';
    scriptTag.onload  = onScriptLoad;

    // Append d3 JS script tag to body
    var body = $document[0].getElementsByTagName('body')[0];
    body.appendChild(scriptTag);

    // Return promise instance to give access to result of deferred action at completion
    return {
      d3: function() {
        return deferred.promise;
      }
    };
  }]);
