angular.module('myApp.d3Directives', ['d3'])

  .directive('d3Bar', ['d3Service', '$window', function(d3Service, $window) {
    return {
      // Restrict directive to be element as semantically more understandable
      restrict: 'E',
      // Define isolate scope for bi-directional data-binding and parent execution binding
      scope: {
        data: '=',
        onClick: '&'
      },
      // Add d3 code in link property
      link: function(scope, element, attributes) {
        // Call d3Service to access library
        d3Service.d3().then(function(d3) {
          console.log('D3 INJECTED');

          // Append responsive svg to directive element
          var svg = d3.select(element[0])
                      .append('svg')
                      .style('width', '100%');

          // Define margin, bar-height and bar-padding to customize properties svg
          var margin      = parseInt(attributes.margin) || 20;
          var barHeight   = parseInt(attributes.barHeight) || 20;
          var barPadding  = parseInt(attributes.barPadding) || 5;

          // Define browser resize event to check for window size changes for re-rendering
          $window.onresize = function() {
            scope.$apply();
          };

          // Define watcher to check size of directive parent element for re-rendering
          scope.$watch(function() {
            return angular.element($window)[0].innerWidth;
          }, function() {
            scope.render(scope.data);
          });

          // Define watcher to check input data changes for re-rendering
          scope.$watch('data', function(newValues, oldValues) {
            return scope.render(newValues);
          }, true);

          // Define render function to apply changes
          scope.render = function(data) {

            // If no data is passed stop render functionalty
            if (!data) return;

            // Before render new data, remove all previous svg elements
            svg.selectAll('*').remove();

            // Calculate width and height
            // Define transition duations for bar and text elements
            // Setup multicolor support
            // define adaptive horizonal scale based on data values
            var width         = d3.select(element[0]).node().offsetWidth - margin;
            var height        = scope.data.length * (barHeight + barPadding);
            var barDuration   = 1000;
            var textDuration  = 400;
            var color         = d3.scaleOrdinal(d3.schemeCategory20);
            var xScale        = d3.scaleLinear()
                                .domain([0, d3.max(data, function(d) {
                                  return d.score;
                                })])
                                .range([0, width]);

            // Set new height based on calculations
            svg.attr('height', height);

            // Generate rectangles for bar chart
            svg.selectAll('rect')
               .data(data).enter()
               // Append rectangle elements to svg based on data
               .append('rect')
               // Define
               .attr('height', barHeight)
               .attr('width', 5)
               // Define positioning of bars based on margin, bar-height and bar-padding
               .attr('x', Math.round(margin/2))
               .attr('y', function(d, i) {
                 return i * (barHeight + barPadding);
               })
               // Fill bars with d3 color functionality
               .attr('fill', function(d) {
                 return color(d.score);
               })
               // Define bars click to return clicked element data
               .on('click', function(d, i) {
                 return scope.onClick({item: d});
               })
               // Apply smooth transition
               .transition()
               // Define transition duration
               .duration(barDuration)
               // Scale bars width based on data values
               .attr('width', function(d) {
                 return xScale(d.score);
               });

            // Generate text labels for bar chart
            svg.selectAll('text')
               .data(data).enter()
               // Append text elements to svg based on data
               .append('text')
               // Display text value based on data
               .text(function(d, i) {
                 return d.name + ': ' + d.score;
               })
               // Define color and dynamic positioning of text elements
               .attr('fill', '#FFFFFF')
               .attr('x', 15)
               .attr('y', function(d, i) {
                 return i * (barHeight + barPadding) + (barHeight / 2 + barPadding);
               })
               // Set initial opacity to zero to hide text elements
               .style('opacity', 0)
               // Set smooth transition to fade in text elements after cretion of bars
               .transition()
               .style('opacity', 1)
               .delay(barDuration)
               .duration(textDuration)
          };
        });
      }};
  }])












































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
            var maxValue  = Math.max.apply(Math,data.map(function(o){return o.value;}));
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
            .value(function(d) {
              d.enabled = true;
              return d.value;
            })
            .sort(null);

          var tooltip = d3.select(element[0])
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
            })
            .each(function(d) { this._current = d; });

            path.on('mouseover', function(d) {
              var total = d3.sum(dataset.map(function(d) {
                console.log((d.enabled) ? d.value : 0)
                return (d.enabled) ? d.value : 0;
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

            path.on('mousemove', function(d) {
              tooltip.style('top', (d3.event.layerY + 10) + 'px')
              .style('left', (d3.event.layerX + 10) + 'px');
            });

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
            .style('stroke', color)
            .on('click', function(label) {
              var rect = d3.select(this);
              console.log(rect)
              var enabled = true;
              var totalEnabled = d3.sum(dataset.map(function(d) {
                console.log((d.enabled) ? 1 : 0)
                return (d.enabled) ? 1 : 0;
              }));
              if (rect.attr('class') === 'disabled') {
                rect.attr('class', '');
              } else {
                if (totalEnabled < 2) return;
                rect.attr('class', 'disabled');
                enabled = false;
              }
              pie.value(function(d) {
                if (d.key === label) d.enabled = enabled;
                return (d.enabled) ? d.value : 0;
              });
              path = path.data(pie(dataset));
              path.transition()
              .duration(750)
              .attrTween('d', function(d) {
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                  return arc(interpolate(t));
                };
              });
            });

            legend.append('text')
              .attr('x', legendRectSize + legendSpacing)
              .attr('y', legendRectSize - legendSpacing)
              .text(function(d) { return d; });
            });
      });
    }};
  }])

  .directive('dotsChart', ['d3Service', function(d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

              var margin = {top: 20, right: 20, bottom: 30, left: 40},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

              /*
              * value accessor - returns the value to encode for a given data object.
              * scale - maps value to a visual display encoding, such as a pixel position.
              * map function - maps from data value to display value
              * axis - sets up axis
              */

              // setup x
              var xValue = function(d) { return parseFloat(d.Paid_fare);}, // data -> value
              xScale = d3.scaleLinear().range([0, width]), // value -> display
              xMap = function(d) { return xScale(xValue(d)); }, // data -> display
              xAxis = d3.axisBottom().scale(xScale);

              // setup y
              var yValue = function(d) { return parseFloat(d.Paid_fare);}, // data -> value
              yScale = d3.scaleLinear().range([height, 0]), // value -> display
              yMap = function(d) { return yScale(yValue(d)); }, // data -> display
              yAxis = d3.axisLeft().scale(yScale);

              // setup fill color
              var cValue = function(d) { return d.Supplier_name;},
                  color = d3.scaleOrdinal(d3.schemeCategory10);

              // add the graph canvas to the body of the webpage
              var svg = d3.select(element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              // add the tooltip area to the webpage
              var tooltip = d3.select(element[0]).append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);

              // load data
              d3.csv('./assets/dataset/home_office_air_travel_data_2011.csv', function(error, data) {

                // change string (from CSV) into number format
                data.forEach(function(d) {
                  d.Paid_fare = +parseFloat(d.Paid_fare);
                  d["Paid_fare (g)"] = +parseFloat(d.Paid_fare);
                  //    console.log(d);
                });

                // don't want dots overlapping axis, so add in buffer to data domain
                xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
                yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

                // x-axis
                svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .append("text")
                .attr("class", "label")
                .attr("x", width)
                .attr("y", -6)
                .style("text-anchor", "end")
                .text("Paid_fare");

                // y-axis
                svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Paid_fare (g)");

                // draw dots
                svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 3.5)
                .attr("cx", xMap)
                .attr("cy", yMap)
                .style("fill", function(d) { return color(cValue(d));})
                .on("mouseover", function(d) {
                  tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
                  tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
                  + ", " + yValue(d) + ")")
                  .style("left", (d3.event.pageX + 5) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                  tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
                });

                // draw legend
                var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                // draw legend colored rectangles
                legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

                // draw legend text
                legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d;})
              });

        });
      }};
  }])

  .directive('planeLogo', ['d3Service', function(d3Service) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var svg = d3.select(element[0])
          .append('svg')
          .attr('width', '100%')
          .attr('height', '100%')
          .append('path')
          .attr('fill', '#FFFFFF')
          .attr('class', 'plane')
          .attr('d', 'm25.21488,3.93375c-0.44355,0 -0.84275,0.18332 -1.17933,0.51592c-0.33397,0.33267 -0.61055,0.80884 -0.84275,1.40377c-0.45922,1.18911 -0.74362,2.85964 -0.89755,4.86085c-0.15655,1.99729 -0.18263,4.32223 -0.11741,6.81118c-5.51835,2.26427 -16.7116,6.93857 -17.60916,7.98223c-1.19759,1.38937 -0.81143,2.98095 -0.32874,4.03902l18.39971,-3.74549c0.38616,4.88048 0.94192,9.7138 1.42461,13.50099c-1.80032,0.52703 -5.1609,1.56679 -5.85232,2.21255c-0.95496,0.88711 -0.95496,3.75718 -0.95496,3.75718l7.53,-0.61316c0.17743,1.23545 0.28701,1.95767 0.28701,1.95767l0.01304,0.06557l0.06002,0l0.13829,0l0.0574,0l0.01043,-0.06557c0,0 0.11218,-0.72222 0.28961,-1.95767l7.53164,0.61316c0,0 0,-2.87006 -0.95496,-3.75718c-0.69044,-0.64577 -4.05363,-1.68813 -5.85133,-2.21516c0.48009,-3.77545 1.03061,-8.58921 1.42198,-13.45404l18.18207,3.70115c0.48009,-1.05806 0.86881,-2.64965 -0.32617,-4.03902c-0.88969,-1.03062 -11.81147,-5.60054 -17.39409,-7.89352c0.06524,-2.52287 0.04175,-4.88024 -0.1148,-6.89989l0,-0.00476c-0.15655,-1.99844 -0.44094,-3.6683 -0.90277,-4.8561c-0.22699,-0.59493 -0.50356,-1.07111 -0.83754,-1.40377c-0.33658,-0.3326 -0.73578,-0.51592 -1.18194,-0.51592l0,0l-0.00001,0l0,0z');
        });
      }};
  }])

  .directive('githubLogo', ['d3Service', function(d3Service) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
          var svg = d3.select(element[0])
          .append('svg')
          .attr('width', '438.549')
          .attr('height', '438.549')
          .attr('viewBox', '0 0 438.549 438.549')
          .append('path')
          .attr('d', 'M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 0 1-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z');
        });
      }};
  }]);
