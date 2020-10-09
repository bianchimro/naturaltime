(function(){
    'use strict';

    angular.module('NaturalTime')
        .directive('suncalcChart', ['$timeout', function($timeout){
        return {

            restrict : 'C',
            scope : {'date' : "=", 'location':"=", times:"=", moment:"="},
            templateUrl : "templates/suncalc-chart.html",
            



            link : function(scope, element, attrs) {
                var svg, cont, yScale, yOrdinalScale, altitudeScale, w,h;
                var padding = 20;
                var timeCont;


                

                
                var startChart = function(){
                    var el = $(element).empty();
                    el = el[0];
                    svg = d3.select(el).append("svg").attr("class", "time-chart");
                    w = parseInt(svg.style("width").replace("px", ""));
                    h = parseInt(svg.style('height').replace("px", ""));

                    

                
                    // define the x scale (horizontal)
                    var mindate = scope.date,
                        maxdate = scope.date;


                    timeCont = svg.append("g")
                        .append("line")
                        .attr("class", "current-time")
                        .attr("x1", 0)
                        .attr("y1", 0)
                        .attr("x2", w)
                        .attr("y2", 0)
                
                    yScale = d3.time.scale()
                        .domain([mindate, maxdate])    // values between for month of january
                        .range([padding, h - padding * 2])
                        .nice(d3.time.day);   // map these the the chart width = total width minus padding at both sides

                    yOrdinalScale = d3.scale.linear()
                        .range([padding*2, h - padding * 4])

                    // define the y axis
                    var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .orient('left')
                        .ticks(24)
                        .tickFormat(d3.time.format("%H:%M"));

                    

                    

                    cont = svg.append("g")
                        .attr("transform", "translate("+(w/4)+",0)")
                    
                    cont.append("g")
                        .attr("class", "axis")
                        .call(yAxis);


                }


                


                var updateChart = function(){
                    
                    console.log("sss", scope.times);

                    
                    var hExtent = d3.extent(scope.times, function(d){ return d.sunriseAltitude });
                    altitudeScale = d3.scale.linear().range([0, 50]).domain(hExtent);
                    yOrdinalScale.domain([0,scope.times.length]);

                    
                    


                    var circlesCont = cont.append("g")
                        .attr("class", "circles");

                    var format = d3.time.format("%H:%M %p");

                    var dEnter = circlesCont
                        .selectAll('g')
                        .data(scope.times)
                            .enter();+

                            dEnter
                                .append('line')
                                .attr('x1', 0)
                                .attr('y1', function(d){ 
                                    var x = yScale(d.time);
                                    return x;
                                })
                                .attr('x2', function(d){
                                    return altitudeScale(d.sunriseAltitude);
                                })
                                .attr('y2', function(d){ 
                                    var x = yScale(d.time);
                                    return x;
                                })
                                .attr('class', 'line-mark')

                            /*
                            dEnter
                            .append('circle')
                                .attr('r', 5)
                                .attr('cx', -120)
                                
                                .attr('cy', function(d,i){ 
                                    var x = yOrdinalScale(i);
                                    return x;
                                    
                                })
                                .attr('fill', 'white')
                                .attr('opacity', .8);
                            */

                            dEnter
                            .append('text')
                                .attr('r', 5)
                                .attr('x', 20+w/10+3)
                                
                                .attr('y', function(d,i){ 
                                    console.log("s",w, 20+w/20+3)
                                    var x = yOrdinalScale(i);
                                    return x+5;
                                    
                                })
                                .attr('fill', 'white')
                                
                                .text( function (d) { return d.label + " " + d.timeFormatted 
                            })
                                .attr("font-family", "sans-serif")
                                .attr("font-size", "14px")
                                .attr('opacity', .4)

                            dEnter
                                .append('line')
                                .attr('x1', function(d){
                                    var out = altitudeScale(d.sunriseAltitude);
                                    
                                    return out;

                                })
                                .attr('y1', function(d){ 
                                    var x = yScale(d.time);
                                    return x;
                                })
                                .attr('x2', 20+w/10)
                                .attr('y2', function(d,i){ 
                                    var x = yOrdinalScale(i);
                                    return x;
                                })
                                .attr('class', 'line-mark')
                                .attr('stroke-dasharray', "4,5")




                            dEnter
                                .append('circle')
                                .attr('r', 5)
                                .attr('cx', function(d, i){
                                    var out = altitudeScale(d.sunriseAltitude);
                                    
                                    return out;
                                })
                                
                                .attr('cy', function(d){ 
                                    
                                    var x = yScale(d.time);
                                    return x;
                                    
                                })
                                .attr('fill', '#f0b840')
                                .attr('opacity', 1);



                
                }


                var setCurrentTime = function(time){
                    var y = yScale(time);
                    timeCont
                        .attr("transform", "translate(0,"+y+")")

                }

                


                scope.$watch('date', function(nv){
                    if(!nv || !svg){return;}
                    setCurrentTime(nv);
                    
                }, true);


                scope.$watch('times', function(nv){
                    if(!nv.length){return;}
                    startChart();
                    updateChart();

                }, true);

                window.onresize = function(){
                    startChart();
                    updateChart();
                }
                    
            
                
                
            }



        }


    }]);
    

}());