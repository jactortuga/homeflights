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
