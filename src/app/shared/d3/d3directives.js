angular.module('myApp.d3Directives', ['d3'])
.directive('barsChart', ['d3Service', function(d3Service) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {

        d3.csv('./assets/dataset/home_office_air_travel_data_2011.csv', function(data){
          console.log(data);

          var expensesCount = d3.nest()
            .key(function(d) { return d[scope.data]; })
            .rollup(function(v) { return v.length; })
            .entries(data);
            console.log(expensesCount);

            //converting all data passed thru into an array
            var data      = expensesCount;
            var maxValue  = Math.max.apply(Math,data.map(function(o){return o.value;}))
            //in D3, any selection[0] contains the group
            //selection[0][0] is the DOM node
            //but we won't need that this time
            var chart = d3.select(element[0]);
            //to our original directive markup bars-chart
            //we add a div with out chart stling and bind each
            //data entry to the chart
            chart.append("div").attr("class", "chart")
            .selectAll('div')
            .data(data).enter()
              .append("div")
              .transition()
              .style("width", function(d) { return (d.value / maxValue * 100) + "%"; })
              .text(function(d) { return d.key + ': ' + d.value; });
            //a little of magic: setting it's width based
            //on the data value (d)
            //and text all with a smooth transition

        });

      });
    }};
}])

.directive('pieChart', ['d3Service', function(d3Service) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function(scope, element, attrs) {
      d3Service.d3().then(function(d3) {


        d3.csv('./assets/dataset/home_office_air_travel_data_2011.csv', function(data){
          console.log(data);

          var expensesCount = d3.nest()
            .key(function(d) { return d[scope.data]; })
            .rollup(function(v) { return v.length; })
            .entries(data);
            console.log(expensesCount);

          var dataset = expensesCount;

            // var width = 360;
            // var height = 360;
            // var radius = Math.min(width, height) / 2;
            // var color = d3.scaleOrdinal(d3.schemeCategory20b);
            // var legendRectSize = 18;
            // var legendSpacing = 4;
            // var svg = d3.select(element[0])
            //   .append('svg')
            //   .attr('width', width)
            //   .attr('height', height)
            //   .append('g')
            //   .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');
            //
            // var arc = d3.arc()
            //   .innerRadius(0)
            //   .outerRadius(radius);
            //
            // var pie = d3.pie()
            //   .value(function(d) { return d.value; })
            //   .sort(null);
            //
            // var path = svg.selectAll('path')
            //   .data(pie(dataset))
            //   .enter()
            //   .append('path')
            //   .attr('d', arc)
            //   .attr('fill', function(d) {
            //     return color(d.data.key);
            //   });
            //
            // var legend = svg.selectAll('.legend')                     // NEW
            //   .data(color.domain())                                   // NEW
            //   .enter()                                                // NEW
            //   .append('g')                                            // NEW
            //   .attr('class', 'legend')                                // NEW
            //   .attr('transform', function(d, i) {                     // NEW
            //     var height = legendRectSize + legendSpacing;          // NEW
            //     var offset =  height * color.domain().length / 2;     // NEW
            //     var horz = -2 * legendRectSize;                       // NEW
            //     var vert = i * height - offset;                       // NEW
            //     return 'translate(' + horz + ',' + vert + ')';        // NEW
            //   });                                                     // NEW
            // legend.append('rect')                                     // NEW
            //   .attr('width', legendRectSize)                          // NEW
            //   .attr('height', legendRectSize)                         // NEW
            //   .style('fill', color)                                   // NEW
            //   .style('stroke', color);                                // NEW
            // legend.append('text')                                     // NEW
            //   .attr('x', legendRectSize + legendSpacing)              // NEW
            //   .attr('y', legendRectSize - legendSpacing)              // NEW
            //   .text(function(d) { return d; });                       // NEW




            var width = 360;
            var height = 360;
            var radius = Math.min(width, height) / 2;
            var donutWidth = 75;
            var legendRectSize = 18;
            var legendSpacing = 4;
            var color = d3.scaleOrdinal(d3.schemeCategory20b);
            var svg = d3.select(element[0])
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

            var arc = d3.arc()
              .innerRadius(radius - donutWidth)
              .outerRadius(radius);

            var pie = d3.pie()
              .value(function(d) { return d.value; })
              .sort(null);

            var tooltip = d3.select('#chart')
              .append('div')
              .attr('class', 'tooltip');

            tooltip.append('div')
              .attr('class', 'key');

            tooltip.append('div')
              .attr('class', 'value');

            tooltip.append('div')
              .attr('class', 'percent');

            var path = svg.selectAll('path')
              .data(pie(dataset))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                return color(d.data.key);
              })                                                        // UPDATED (removed semicolon)
              .each(function(d) { this._current = d; });                // NEW
              path.on('mouseover', function(d) {
                var total = d3.sum(dataset.map(function(d) {
                  return (d.enabled) ? d.value : 0;                       // UPDATED
                }));
                var percent = Math.round(1000 * d.data.value / total) / 10;
                tooltip.select('.key').html(d.data.key);
                tooltip.select('.value').html(d.data.value);
                tooltip.select('.percent').html(percent + '%');
                tooltip.style('display', 'block');
              });
              path.on('mouseout', function() {
                tooltip.style('display', 'none');
              });
              /* OPTIONAL
              path.on('mousemove', function(d) {
              tooltip.style('top', (d3.event.layerY + 10) + 'px')
              .style('left', (d3.event.layerX + 10) + 'px');
            });
            */
            var legend = svg.selectAll('.legend')
              .data(color.domain())
              .enter()
              .append('g')
              .attr('class', 'legend')
              .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset =  height * color.domain().length / 2;
                var horz = -2 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

            legend.append('rect')
              .attr('width', legendRectSize)
              .attr('height', legendRectSize)
              .style('fill', color)
              .style('stroke', color)                                   // UPDATED (removed semicolon)
              .on('click', function(label) {                            // NEW
                var rect = d3.select(this);                             // NEW
                var enabled = true;                                     // NEW
                var totalEnabled = d3.sum(dataset.map(function(d) {     // NEW
                  return (d.enabled) ? 1 : 0;                           // NEW
                }));                                                    // NEW
                if (rect.attr('class') === 'disabled') {                // NEW
                  rect.attr('class', '');                               // NEW
                } else {                                                // NEW
                  if (totalEnabled < 2) return;                         // NEW
                  rect.attr('class', 'disabled');                       // NEW
                  enabled = false;                                      // NEW
                }                                                       // NEW
              pie.value(function(d) {                                 // NEW
                if (d.key === label) d.enabled = enabled;           // NEW
                return (d.enabled) ? d.value : 0;                     // NEW
              });                                                     // NEW
              path = path.data(pie(dataset));                         // NEW
              path.transition()                                       // NEW
              .duration(750)                                        // NEW
              .attrTween('d', function(d) {                         // NEW
                var interpolate = d3.interpolate(this._current, d); // NEW
                this._current = interpolate(0);                     // NEW
                return function(t) {                                // NEW
                  return arc(interpolate(t));                       // NEW
                };                                                  // NEW
              });                                                   // NEW
            });                                                       // NEW
            legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize - legendSpacing)
            .text(function(d) { return d; });

              });
      });
    }};
  }]);


































// .directive('d3Bars', ['d3Service', '$window', function(d3Service, $window) {
//   return {
//     restrict: 'EA',
//     scope: {},
//     link: function(scope, element, attrs) {
//       d3Service.d3().then(function(d3) {
//         var margin = parseInt(attrs.margin) || 20,
//             barHeight = parseInt(attrs.barHeight) || 20,
//             barPadding = parseInt(attrs.barPadding) || 5;
//         var svg = d3.select(element[0])
//           .append('svg')
//           .style('width', '100%');
//
//         // Browser onresize event
//         window.onresize = function() {
//           scope.$apply();
//         };
//
//         // hard-code data
//         scope.data = [
//           {name: "Greg", score: 98},
//           {name: "Ari", score: 96},
//           {name: 'Q', score: 75},
//           {name: "Loser", score: 48}
//         ];
//
//         scope.render = function(data) {
//           // remove all previous items before render
//           svg.selectAll('*').remove();
//
//           // If we don't pass any data, return out of the element
//           if (!data) return;
//
//           // setup variables
//           var width = d3.select(ele[0]).node().offsetWidth - margin,
//           // calculate the height
//           height = scope.data.length * (barHeight + barPadding),
//           // Use the category20() scale function for multicolor support
//           color = d3.scale.category20(),
//           // our xScale
//           xScale = d3.scale.linear()
//           .domain([0, d3.max(data, function(d) {
//             return d.score;
//           })])
//           .range([0, width]);
//
//           // set the height based on the calculations above
//           svg.attr('height', height);
//
//           //create the rectangles for the bar chart
//           svg.selectAll('rect')
//           .data(data).enter()
//           .append('rect')
//           .attr('height', barHeight)
//           .attr('width', 140)
//           .attr('x', Math.round(margin/2))
//           .attr('y', function(d,i) {
//             return i * (barHeight + barPadding);
//           })
//           .attr('fill', function(d) { return color(d.score); })
//           .transition()
//           .duration(1000)
//           .attr('width', function(d) {
//             return xScale(d.score);
//           });
//         };
//
//         // Watch for resize event
//         scope.$watch(function() {
//           return angular.element($window)[0].innerWidth;
//         }, function() {
//           scope.render(scope.data);
//         });
//
//         scope.render = function(data) {
//           // our custom d3 code
//         }
//       });
//     }};
// }]);
