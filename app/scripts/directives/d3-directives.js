
(function(){

var d3directives = angular.module('d3directives', []);

d3directives.directive('d3Bar2',['$window', '$timeout', function($window, $timeout){
    
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            title: '@',
            onClick: '&'
        },
        link: function(scope, ele, attrs){
            var renderTimeout;

            var title = scope.title;

             var margin = {
                    top: parseInt(attrs.margin) || 20,
                    right: parseInt(attrs.margin) || 10,
                    bottom: parseInt(attrs.margin) || 30,
                    left: parseInt(attrs.margin) ||  10,
                },
                barHeight = parseInt(attrs.barHeight) || 15,
                barPadding = parseInt(attrs.barPadding) || 5;

            var svg = d3.select(ele[0])
                .append('svg')
                .style('width', '100%');

            // Browser onresize event
            window.onresize = function() {
                scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });

            // watch for data updates
            scope.$watch('data', function(newVals, oldVals) {
              return scope.render(newVals);
            }, true);

            scope.render = function(data) {

                // console.log('data', data);

              // remove all previous items before render
                svg.selectAll('*').remove();
                // If we don't pass any data, return out of the element
                if (!data) return;

                // setup variables
                // var width = d3.select(ele[0]).node().offsetWidth - margin,
                var width = ele.parent().width() - margin.left - margin.right,
                    // calculate the height
                    chartHeight = (scope.data.length * (barHeight + barPadding)),
                    // Use the category20() scale function for multicolor support
                    color = d3.scale.category20(),
                    // color2 = d3.scale.category20(),

                    // color = d3.scale.ordinal()
                    //         .domain([0, d3.max(data, function(d) {
                    //             return d.count;
                    //         })])
                    //         .range(['#edf8b1', '#2c7fb8']),

                    // our xScale
                    xScale = d3.scale.linear()
                      .domain([0, d3.max(data, function(d) {
                        return d.count;
                      })])
                      .range([0, width]);

                

                // set the height based on the calculations above
                svg.attr("width", width + margin.left + margin.right)
                    .attr("height", chartHeight + margin.top + margin.bottom)

                var chart = svg.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //add axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom');

                // var yAxis = d3.svg.axis()
                //     .scale(y)
                //     .orient('left');

                // chart.append('g')
                //     .attr('class', 'x axis')
                //     .attr("transform", "translate(" + margin.left + "," + (chartHeight - margin.bottom)  + ")")
                //     .call(xAxis);

                //create the rectangles for the bar chart
                var bar = chart.selectAll('.bar')
                  .data(data)
                  .enter().append('g')
                  .attr('class','bar')
                  .attr('transform', function(d, i) { return "translate(0," + i * (barHeight + barPadding) + ")"; });

                bar.append('rect')
                    .attr('height', barHeight)
                    .attr('width', 5)
                    .attr('fill', function(d,i) { return color(i); })
                    .transition()
                      .duration(800)
                      .attr('width', function(d) {
                        // console.log(xScale(d.count));
                        return xScale(d.count);
                      })
                    
                bar.append('text')
                    .attr('x', 20)
                    .attr('y', 12)
                    // .attr('fill', function(d, i) { return color(i + 2); })
                    .text(function(d) { return d.term + ' -- ' + d.count; });

                bar.on('click', function(d,i){
                    return scope.onClick({filter: d.term});
                })


                svg.append('g')
                    .attr('class', 'title')
                    .append('text')
                        .attr('y', 10)
                        .attr('x', 20)
                        .style('font-size','0.8em')
                        .style('font-weight', 'bold')
                        .text(title);
                }
            }
    }
}])

.directive('d3OneBar',['$window', '$timeout', function($window, $timeout){
    
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            title: '@',
            onClick: '&'
        },
        link: function(scope, ele, attrs){
            var renderTimeout;

            // var title = scope.title;

             var margin = {
                    top: parseInt(attrs.margin) || 10,
                    right: parseInt(attrs.margin) || 20,
                    bottom: parseInt(attrs.margin) || 10,
                    left: parseInt(attrs.margin) || 20,
                },
                barHeight = parseInt(attrs.barHeight) || 5,
                barPadding = parseInt(attrs.barPadding) || 5;

            var svg = d3.select(ele[0])
                .append('svg')
                .style('width', '100%');

            // Browser onresize event
            window.onresize = function() {
                scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });

            // watch for data updates
            scope.$watch('data', function(newVals, oldVals) {
              return scope.render(newVals);
            }, true);

            scope.render = function(data) {

                // console.log('data', data);

              // remove all previous items before render
                svg.selectAll('*').remove();
                // If we don't pass any data, return out of the element
                if (!data) return;

                // setup variables
                // var width = d3.select(ele[0]).node().offsetWidth - margin,
                var width = ele.parent().width() -margin.left -margin.right,
                    // calculate the height
                    chartHeight = 2 * (barHeight + barPadding),

                    // Use the category20() scale function for multicolor support
                    color = d3.scale.category10(),

                    // our xScale
                    xScale = d3.scale.linear()
                      .domain([0, d3.sum(data, function(d) {
                        return d.count;
                      })])
                      .range([0, width]);

                    // console.log(xScale.domain());

                //sort data by term!!
                data.sort(function(a, b){
                    return d3.ascending(a.term, b.term);
                })

                

                // set the height based on the calculations above
                svg.attr('height', chartHeight + margin.top + margin.bottom);

                //create the rectangles for the bar chart
                var offsets = [0];

                var chart = svg.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                var bar = chart.selectAll('g')
                  .data(data)
                  .enter().append('g')
                  // .attr('class', function(d){ return d.term})
                  .attr('transform', function(d, i) { 
                    // console.log(xScale(d.count), 'offset', offsetNext);
                    // return "translate(0," + offsets[i] + ")" ; 
                  });

                bar.append('rect')
                    .attr('height', barHeight)
                    .attr('width', 5)
                    .attr('fill', function(d) { return color(d.count); })
                    .attr('x', 0)
                    .transition()
                      .duration(800)
                      .attr('x', function(d,i){
                        var offset = d3.sum(offsets.slice(0,i+1));
                        // console.log(i, offset);
                        offsets.push(xScale(d.count));
                        return offset;
                      })
                      .attr('width', function(d) {
                        return xScale(d.count);
                      })
                      
                    
                bar.append('text')
                    .attr('x', function(d,i){
                        var offset = d3.sum(offsets.slice(0,i+1));
                        // console.log('width', width, 'offset', offset);
                        // add code here to hide text if width - offset is too small
                        // if possible, show on hover instead.
                        return offset;
                    })
                    .attr('y', 10)
                    .attr('dy', '.71em')
                    .attr('fill', function(d) { return color(d.count); })
                    .text(function(d) { return d.count + ' ' + d.term + 's'; });


                // deal with text that is too long for its box
                
                bar.selectAll('text')
                    .attr('class', function(d,i){
                        var textW = this.getBBox().width;
                        var boxW = xScale(d.count);
                        if (boxW < textW ) {
                            return 'b-text '+ 'too-short';  // 'too-short' class will be hidden until bar is hovered with css
                        }

                        return 'b-text';
                    })

                bar.on('click', function(d,i){
                    return scope.onClick({filter: d.term});
                })

                // var xAxis = d3.svg.axis()
                //     .scale(xScale)
                //     .orient('bottom');

                // // var yAxis = d3.svg.axis()
                // //     .scale(y)
                // //     .orient('left');

                // chart.append('g')
                //     .attr('class', 'x axis')
                //     .attr("transform", "translate(0," + (chartHeight - 1.5 * barHeight)  + ")")
                //     .call(xAxis);
                }
            }
    }
}])

.directive('d3Area',['$window', '$timeout', function($window, $timeout){
    
    return {
        restrict: 'EA',
        scope: {
            data: '=',
            title: '@'
        },
        link: function(scope, ele, attrs){
            var renderTimeout;

            var title = scope.title;

             var margin = {
                    top: parseInt(attrs.margin) || 20,
                    right: parseInt(attrs.margin) || 20,
                    bottom: parseInt(attrs.margin) || 20,
                    left: parseInt(attrs.margin) || 40,
                },
                height = 120;

            // var chart = d3.select(ele[0])
            //     .append('svg')
            //     .style('width', '100%');

             var svg = d3.select(ele[0]).append('svg');

            // Browser onresize event
            

            window.onresize = function() {
                scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
              return angular.element($window)[0].innerWidth;
            }, function() {
              scope.render(scope.data);
            });

            // watch for data updates
            scope.$watch('data', function(newVals, oldVals) {
              return scope.render(newVals);
            }, true);

            scope.render = function(data) {

                // console.log('data', data);

              // remove all previous items before render
                svg.selectAll('*').remove();
                // If we don't pass any data, return out of the element
                if (!data) return;

                // setup variables

                var width = ele.parent().width() - margin.right - margin.left,
                    chartHeight = height - margin.top - margin.bottom;

                var parseDate = d3.time.format('%Y-%m-%d').parse;
                // var parseDate = d3.time.format("%d-%b-%y").parse;

                var x = d3.time.scale()
                        .range([0, width]);

                var y = d3.scale.linear()
                        .range([chartHeight, 0]);

                var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient('bottom')
                            .ticks(10);

                var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient('left')
                            .ticks(3);

                var emptyArea = d3.svg.area()
                                .x(function(d) { return x(d.date) })
                                .y(chartHeight)
                                .interpolate('monotone');

                var area = d3.svg.area()
                            .x(function(d) { return x(d.date) })
                            .y0(chartHeight)
                            .y1(function(d){ return y(d.count) })
                            .interpolate('basis');

                // var valueline = d3.svg.line()
                //                 .x(function(d){ return x(d.date)})
                //                 .y(function(d){ return y(d.count)});

                // apply svg attribs
                

                // parse data
                data.forEach(function(d){
                    d.date = parseDate(d.time);
                    d.count = +d.count;
                });

                //sort data by date!!
                data.sort(function(a, b){
                    return d3.ascending(a.date, b.date);
                })

                // set domains
                x.domain(d3.extent(data, function(d){ return d.date; }));
                y.domain([0, d3.max(data, function(d){ return d.count; })]);

                // console.log(x.domain(), x.range());
                // console.log(y.domain(), y.range());
                

                svg.attr('width', width + margin.left + margin.right)
                    .attr('height', height);

                var chart = svg.append('g')
                        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

                //draw area
                chart.append('path')
                    .datum(data)
                    // .attr('class', 'area')
                    .attr('fill','orange')
                    .attr('d', emptyArea)
                        .transition().duration(600)
                        .attr('d', area);

                // add axes
                chart.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' + chartHeight + ')')
                    .call(xAxis);

                chart.append('g')
                    .attr('class', 'y axis')
                    .call(yAxis)
                    .append('text')
                        .attr('transform', 'rotate(-90)')
                        .attr('y', 6)
                        .attr('dy', '.71em')
                        .style('text-anchor', 'end');
                        // .text('Count');

                chart.append('g')
                    .attr('class', 'title')
                    .append('text')
                        .attr('y', 0)
                        .attr('x', 20)
                        .style('font-size','0.8em')
                        .style('font-weight', 'bold')
                        .text(title);

                var brush = d3.svg.brush()
                            .x(x)
                            .extent(x.domain())
                            .on("brushstart", brushstart)
                            .on("brush", brushmove)
                            .on("brushend", brushend);

                // var handle = d3.svg.line();
                var brushbg = chart.append('g')
                        .attr('class','brushbg');

                var brushg = chart.append("g")
                    .attr("class", "brush")
                    .call(brush);

                brushbg.append('rect')
                    .attr('class', 'bbg l')
                    .attr('height', chartHeight);

                brushbg.append('rect')
                    .attr('class', 'bbg r')
                    .attr('height', chartHeight);

                brushg.selectAll(".resize")
                    .append('rect')
                        .attr('width', 2)
                        .style('visibility', 'visible')
                        .style('fill', 'red')

                brushg.selectAll('.background')
                        .style({'visibility': 'visible', 'fill': 'none'})
                        .append('rect')
                            .attr('class', 'left')
                            .attr('x', 0)
                            .attr('width', 20)
                            .style({'fill': 'red', 'visibility': 'visible'});

                brushg.selectAll("rect")
                    .attr("height", chartHeight);

                // brushstart();
                // brushmove();

                function brushstart() {
                    // updateBBG();
                    console.log('brushstart', brush.extent());
                  // svg.classed("selecting", true);
                }

                function brushmove() {
                    
                  var s = brush.extent();
                  // console.log('brushmove', s);
                  updateBBG();
                  // circle.classed("selected", function(d) { return s[0] <= d && d <= s[1]; });
                }

                function brushend() {
                  if (brush.empty()){
                    brushbg.selectAll('.bbg')
                        .attr('width', 0);
                    }
                }

                function updateBBG() {

                    var eX = parseInt(brushg.selectAll('.extent').attr('x'));
                    var eW = parseInt(brushg.selectAll('.extent').attr('width'));

                    brushbg.select('.l')
                        .attr('x', 0)
                        .attr('width', function(){
                            return eX;
                    });
                    brushbg.select('.r')
                        .attr('x', function(){
                            // console.log('x', eX, 'w', eW, 'both', eX + eW);
                            return eX + eW;
                        })
                        .attr('width', function(){
                            return width - eW - eX;
                    });
                }
            }
        }
    }
}]);

})();