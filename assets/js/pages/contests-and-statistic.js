/* ------------------------------------------------------------------------------
 *
 *  # Contests & Statistic page
 *
 * ---------------------------------------------------------------------------- */

$(function() {
    
    //*******************CONTEST STATISTICS TAB*******************

    // Bar charts with random data
    // ------------------------------

    // Chart setup
    function generateBarChart(element, barQty, height, animate, easing, duration, delay, color, tooltip) {


        // Basic setup
        // ------------------------------

        // Add data set
        var bardata = [];
        for (var i=0; i < barQty; i++) {
            bardata.push(Math.round(Math.random()*10) + 10)
        }

        // Main variables
        var d3Container = d3.select(element),
            width = d3Container.node().getBoundingClientRect().width;



        // Construct scales
        // ------------------------------

        // Horizontal
        var x = d3.scale.ordinal()
            .rangeBands([0, width], 0.3)

        // Vertical
        var y = d3.scale.linear()
            .range([0, height]);



        // Set input domains
        // ------------------------------

        // Horizontal
        x.domain(d3.range(0, bardata.length))

        // Vertical
        y.domain([0, d3.max(bardata)])



        // Create chart
        // ------------------------------

        // Add svg element
        var container = d3Container.append('svg');

        // Add SVG group
        var svg = container
            .attr('width', width)
            .attr('height', height)
            .append('g');



        //
        // Append chart elements
        //

        // Bars
        var bars = svg.selectAll('rect')
            .data(bardata)
            .enter()
            .append('rect')
            .attr('class', 'd3-random-bars')
            .attr('width', x.rangeBand())
            .attr('x', function(d,i) {
                return x(i);
            })
            .style('fill', color);



        // Tooltip
        // ------------------------------

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0]);

        // Show and hide
        if(tooltip == "won") {
            bars.call(tip)
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }

        // Online members tooltip content
        if(tooltip == "won") {
            tip.html(function (d, i) {
                return "<div class='text-center'>" +
                    "<h6 class='no-margin'>" + d + "0" + "</h6>" +
                    "<span class='text-size-small'>members</span>" +
                    "<div class='text-size-small'>" + i + ":00" + "</div>" +
                    "</div>"
            });
        }



        // Bar loading animation
        // ------------------------------

        // Choose between animated or static
        if(animate) {
            withAnimation();
        } else {
            withoutAnimation();
        }

        // Animate on load
        function withAnimation() {
            bars
                .attr('height', 0)
                .attr('y', height)
                .transition()
                .attr('height', function(d) {
                    return y(d);
                })
                .attr('y', function(d) {
                    return height - y(d);
                })
                .delay(function(d, i) {
                    return i * delay;
                })
                .duration(duration)
                .ease(easing);
        }

        // Load without animateion
        function withoutAnimation() {
            bars
                .attr('height', function(d) {
                    return y(d);
                })
                .attr('y', function(d) {
                    return height - y(d);
                })
        }



        // Resize chart
        // ------------------------------

        // Call function on window resize
        $(window).on('resize', barsResize);

        // Call function on sidebar width change
        $(document).on('click', '.sidebar-control', barsResize);

        // Resize function
        // 
        // Since D3 doesn't support SVG resize by default,
        // we need to manually specify parts of the graph that need to 
        // be updated on window resize
        function barsResize() {

            // Layout variables
            width = d3Container.node().getBoundingClientRect().width;


            // Layout
            // -------------------------

            // Main svg width
            container.attr("width", width);

            // Width of appended group
            svg.attr("width", width);

            // Horizontal range
            x.rangeBands([0, width], 0.3);


            // Chart elements
            // -------------------------

            // Bars
            svg.selectAll('.d3-random-bars')
                .attr('width', x.rangeBand())
                .attr('x', function(d,i) {
                    return x(i);
                });
        }
    }




    // Sparklines
    // ------------------------------

    // Chart setup
    function sparkline(element, chartType, qty, height, interpolation, duration, interval, color) {


        // Basic setup
        // ------------------------------

        // Define main variables
        var d3Container = d3.select(element),
            margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right,
            height = height - margin.top - margin.bottom;


        // Generate random data (for demo only)
        var data = [];
        for (var i=0; i < qty; i++) {
            data.push(Math.floor(Math.random() * qty) + 5)
        }



        // Construct scales
        // ------------------------------

        // Horizontal
        var x = d3.scale.linear().range([0, width]);

        // Vertical
        var y = d3.scale.linear().range([height - 5, 5]);



        // Set input domains
        // ------------------------------

        // Horizontal
        x.domain([1, qty - 3])

        // Vertical
        y.domain([0, qty])



        // Construct chart layout
        // ------------------------------

        // Line
        var line = d3.svg.line()
            .interpolate(interpolation)
            .x(function(d, i) { return x(i); })
            .y(function(d, i) { return y(d); });

        // Area
        var area = d3.svg.area()
            .interpolate(interpolation)
            .x(function(d,i) {
                return x(i);
            })
            .y0(height)
            .y1(function(d) {
                return y(d);
            });



        // Create SVG
        // ------------------------------

        // Container
        var container = d3Container.append('svg');

        // SVG element
        var svg = container
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        // Add mask for animation
        // ------------------------------

        // Add clip path
        var clip = svg.append("defs")
            .append("clipPath")
            .attr('id', function(d, i) { return "load-clip-" + element.substring(1) })

        // Add clip shape
        var clips = clip.append("rect")
            .attr('class', 'load-clip')
            .attr("width", 0)
            .attr("height", height);

        // Animate mask
        clips
            .transition()
            .duration(1000)
            .ease('linear')
            .attr("width", width);



        //
        // Append chart elements
        //

        // Main path
        var path = svg.append("g")
            .attr("clip-path", function(d, i) { return "url(#load-clip-" + element.substring(1) + ")"})
            .append("path")
            .datum(data)
            .attr("transform", "translate(" + x(0) + ",0)");

        // Add path based on chart type
        if(chartType == "area") {
            path.attr("d", area).attr('class', 'd3-area').style("fill", color); // area
        }
        else {
            path.attr("d", line).attr("class", "d3-line d3-line-medium").style('stroke', color); // line
        }

        // Animate path
        path
            .style('opacity', 0)
            .transition()
            .duration(750)
            .style('opacity', 1);



        // Set update interval. For demo only
        // ------------------------------

        setInterval(function() {

            // push a new data point onto the back
            data.push(Math.floor(Math.random() * qty) + 5);

            // pop the old data point off the front
            data.shift();

            update();

        }, interval);



        // Update random data. For demo only
        // ------------------------------

        function update() {

            // Redraw the path and slide it to the left
            path
                .attr("transform", null)
                .transition()
                .duration(duration)
                .ease("linear")
                .attr("transform", "translate(" + x(0) + ",0)");

            // Update path type
            if(chartType == "area") {
                path.attr("d", area).attr('class', 'd3-area').style("fill", color)
            }
            else {
                path.attr("d", line).attr("class", "d3-line d3-line-medium").style('stroke', color);
            }
        }



        // Resize chart
        // ------------------------------

        // Call function on window resize
        $(window).on('resize', resizeSparklines);

        // Call function on sidebar width change
        $(document).on('click', '.sidebar-control', resizeSparklines);

        // Resize function
        //
        // Since D3 doesn't support SVG resize by default,
        // we need to manually specify parts of the graph that need to
        // be updated on window resize
        function resizeSparklines() {

            // Layout variables
            width = d3Container.node().getBoundingClientRect().width - margin.left - margin.right;


            // Layout
            // -------------------------

            // Main svg width
            container.attr("width", width + margin.left + margin.right);

            // Width of appended group
            svg.attr("width", width + margin.left + margin.right);

            // Horizontal range
            x.range([0, width]);


            // Chart elements
            // -------------------------

            // Clip mask
            clips.attr("width", width);

            // Line
            svg.select(".d3-line").attr("d", line);

            // Area
            svg.select(".d3-area").attr("d", area);
        }
    }


    // Initialize chart

    var chartTabClick = false;

    $('.nav-tabs-bottom .run-charts').on('click', function () {

        if(!chartTabClick) {
            setTimeout(function () {
                generateBarChart("#won-contests", 24, 50, true, "elastic", 1200, 50, "rgba(255,255,255,0.5)", "won");
                sparkline("#preferred-contests", "area", 30, 50, "basis", 750, 2000, "rgba(255,255,255,0.5)");
                sparkline("#most-clicked-contests", "area", 30, 50, "basis", 750, 2000, "rgba(255,255,255,0.5)");
                sparkline("#submissions-turnaround", "area", 30, 50, "basis", 750, 2000, "rgba(255,255,255,0.5)");
            },500);

            chartTabClick = true
        }
        
    });



    
    //*******************CONTESTS STATS TAB*******************

    // Switchery toggles
    // ------------------------------

    var switches = Array.prototype.slice.call(document.querySelectorAll('.switch'));
    switches.forEach(function(html) {
        var switchery = new Switchery(html, {color: '#4CAF50'});
    });



    // Marketing campaigns donut chart
    // ------------------------------

    // Initialize chart
    campaignDonut("#campaigns-donut", 42);

    // Chart setup
    function campaignDonut(element, size) {


        // Basic setup
        // ------------------------------

        // Add data set
        var data = [
            {
                "browser": "Google Adwords",
                "icon": "<i class='icon-google position-left'></i>",
                "value": 1047,
                "color" : "#66BB6A"
            }, {
                "browser": "Social media",
                "icon": "<i class='icon-share4 position-left'></i>",
                "value": 2948,
                "color": "#9575CD"
            }, {
                "browser":"Youtube video",
                "icon": "<i class='icon-youtube position-left'></i>",
                "value": 3909,
                "color": "#FF7043"
            }
        ];

        // Main variables
        var d3Container = d3.select(element),
            distance = 2, // reserve 2px space for mouseover arc moving
            radius = (size/2) - distance,
            sum = d3.sum(data, function(d) { return d.value; })



        // Tooltip
        // ------------------------------

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('e')
            .html(function (d) {
                return "<ul class='list-unstyled mb-5'>" +
                    "<li>" + "<div class='text-size-base mb-5 mt-5'>" + d.data.icon + d.data.browser + "</div>" + "</li>" +
                    "<li>" + "Visits: &nbsp;" + "<span class='text-semibold pull-right'>" + d.value + "</span>" + "</li>" +
                    "<li>" + "Share: &nbsp;" + "<span class='text-semibold pull-right'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
            })



        // Create chart
        // ------------------------------

        // Add svg element
        var container = d3Container.append("svg").call(tip);

        // Add SVG group
        var svg = container
            .attr("width", size)
            .attr("height", size)
            .append("g")
            .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");



        // Construct chart layout
        // ------------------------------

        // Pie
        var pie = d3.layout.pie()
            .sort(null)
            .startAngle(Math.PI)
            .endAngle(3 * Math.PI)
            .value(function (d) {
                return d.value;
            });

        // Arc
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius / 2);



        //
        // Append chart elements
        //

        // Group chart elements
        var arcGroup = svg.selectAll(".d3-arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "d3-arc")
            .style('stroke', '#fff')
            .style('cursor', 'pointer');

        // Append path
        var arcPath = arcGroup
            .append("path")
            .style("fill", function (d) { return d.data.color; });

        // Add tooltip
        arcPath
            .on('mouseover', function (d, i) {

                // Transition on mouseover
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('elastic')
                    .attr('transform', function (d) {
                        d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                        var x = Math.sin(d.midAngle) * distance;
                        var y = -Math.cos(d.midAngle) * distance;
                        return 'translate(' + x + ',' + y + ')';
                    });
            })

            .on("mousemove", function (d) {

                // Show tooltip on mousemove
                tip.show(d)
                    .style("top", (d3.event.pageY - 40) + "px")
                    .style("left", (d3.event.pageX + 30) + "px");
            })

            .on('mouseout', function (d, i) {

                // Mouseout transition
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .attr('transform', 'translate(0,0)');

                // Hide tooltip
                tip.hide(d);
            });

        // Animate chart on load
        arcPath
            .transition()
            .delay(function(d, i) { return i * 500; })
            .duration(500)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            });
    }




    // Campaign status donut chart
    // ------------------------------

    // Initialize chart
    campaignStatusPie("#campaign-status-pie", 42);

    // Chart setup
    function campaignStatusPie(element, size) {


        // Basic setup
        // ------------------------------

        // Add data set
        var data = [
            {
                "status": "Active campaigns",
                "icon": "<span class='status-mark border-blue-300 position-left'></span>",
                "value": 439,
                "color": "#29B6F6"
            }, {
                "status": "Closed campaigns",
                "icon": "<span class='status-mark border-danger-300 position-left'></span>",
                "value": 290,
                "color": "#EF5350"
            }, {
                "status": "Pending campaigns",
                "icon": "<span class='status-mark border-success-300 position-left'></span>",
                "value": 190,
                "color": "#81C784"
            }, {
                "status": "Campaigns on hold",
                "icon": "<span class='status-mark border-grey-300 position-left'></span>",
                "value": 148,
                "color": "#999"
            }
        ];

        // Main variables
        var d3Container = d3.select(element),
            distance = 2, // reserve 2px space for mouseover arc moving
            radius = (size/2) - distance,
            sum = d3.sum(data, function(d) { return d.value; })



        // Tooltip
        // ------------------------------

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .direction('e')
            .html(function (d) {
                return "<ul class='list-unstyled mb-5'>" +
                    "<li>" + "<div class='text-size-base mb-5 mt-5'>" + d.data.icon + d.data.status + "</div>" + "</li>" +
                    "<li>" + "Total: &nbsp;" + "<span class='text-semibold pull-right'>" + d.value + "</span>" + "</li>" +
                    "<li>" + "Share: &nbsp;" + "<span class='text-semibold pull-right'>" + (100 / (sum / d.value)).toFixed(2) + "%" + "</span>" + "</li>" +
                    "</ul>";
            })



        // Create chart
        // ------------------------------

        // Add svg element
        var container = d3Container.append("svg").call(tip);

        // Add SVG group
        var svg = container
            .attr("width", size)
            .attr("height", size)
            .append("g")
            .attr("transform", "translate(" + (size / 2) + "," + (size / 2) + ")");



        // Construct chart layout
        // ------------------------------

        // Pie
        var pie = d3.layout.pie()
            .sort(null)
            .startAngle(Math.PI)
            .endAngle(3 * Math.PI)
            .value(function (d) {
                return d.value;
            });

        // Arc
        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius / 2);



        //
        // Append chart elements
        //

        // Group chart elements
        var arcGroup = svg.selectAll(".d3-arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "d3-arc")
            .style('stroke', '#fff')
            .style('cursor', 'pointer');

        // Append path
        var arcPath = arcGroup
            .append("path")
            .style("fill", function (d) { return d.data.color; });

        // Add tooltip
        arcPath
            .on('mouseover', function (d, i) {

                // Transition on mouseover
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('elastic')
                    .attr('transform', function (d) {
                        d.midAngle = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
                        var x = Math.sin(d.midAngle) * distance;
                        var y = -Math.cos(d.midAngle) * distance;
                        return 'translate(' + x + ',' + y + ')';
                    });
            })

            .on("mousemove", function (d) {

                // Show tooltip on mousemove
                tip.show(d)
                    .style("top", (d3.event.pageY - 40) + "px")
                    .style("left", (d3.event.pageX + 30) + "px");
            })

            .on('mouseout', function (d, i) {

                // Mouseout transition
                d3.select(this)
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .attr('transform', 'translate(0,0)');

                // Hide tooltip
                tip.hide(d);
            });

        // Animate chart on load
        arcPath
            .transition()
            .delay(function(d, i) { return i * 500; })
            .duration(500)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(d.startAngle,d.endAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            });
    }



    //*******************PRICING SETTINGS TAB*******************

    //
    // Designer behaviour
    //

    // Define element
    slider_designer_behaviour = document.getElementById('noui-slider-designer');

    // Create slider
    noUiSlider.create(slider_designer_behaviour, {
        start: 70,
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min':  0,
            'max':  100
        },
        format: wNumb({
            decimals: 3,
            thousand: '.',
            postfix: '%',
        })
    });

    // Define elements for values
    var slider_designer_behaviour_val = document.getElementById('noui-slider-designer-val');

    // Show the values
    slider_designer_behaviour.noUiSlider.on('update', function( values, handle ) {
        slider_designer_behaviour_val.innerHTML = values[handle];
    });

    // Bind designContest slider
    slider_designer_behaviour.noUiSlider.on('change.one', function(val){
        var sliderValue = val.toString().slice(0, -1)
        var bindSlider = (100 - sliderValue);
        slider_contest_behaviour.noUiSlider.set(bindSlider);
    });




    //
    // Contest behaviour
    //

    // Define element
    slider_contest_behaviour = document.getElementById('noui-slider-contest');

    // Create slider
    noUiSlider.create(slider_contest_behaviour, {
        start: 30,
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min':  0,
            'max':  100
        },
        format: wNumb({
            decimals: 3,
            thousand: '.',
            postfix: '%',
        })
    });

    // Define elements for values
    var slider_contest_behaviour_val = document.getElementById('noui-slider-contest-val');

    // Show the values
    slider_contest_behaviour.noUiSlider.on('update', function( values, handle ) {
        slider_contest_behaviour_val.innerHTML = values[handle];
    });




    //
    // Winner behaviour
    //

    // Define element
    slider_winner_behaviour = document.getElementById('noui-slider-winner');

    // Create slider
    noUiSlider.create(slider_winner_behaviour, {
        start: 70,
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min':  0,
            'max':  100
        },
        format: wNumb({
            decimals: 3,
            thousand: '.',
            postfix: '%',
        })
    });

    // Define elements for values
    var slider_winner_behaviour_val = document.getElementById('noui-slider-winner-val');

    // Show the values
    slider_winner_behaviour.noUiSlider.on('update', function( values, handle ) {
        slider_winner_behaviour_val.innerHTML = values[handle];
    });

    // Bind 2th place slider slider
    slider_winner_behaviour.noUiSlider.on('change.one', function(val){
        var sliderValue = val.toString().slice(0, -1)
        var bindSlider = (100 - sliderValue);
        slider_second_position_behaviour.noUiSlider.set(bindSlider);
        slider_third_position_behaviour.noUiSlider.set(0);
    });




    //
    // Second position  behaviour
    //

    // Define element
    slider_second_position_behaviour = document.getElementById('noui-slider-second-position');

    // Create slider
    noUiSlider.create(slider_second_position_behaviour, {
        start: 20,
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min':  0,
            'max':  100
        },
        format: wNumb({
            decimals: 3,
            thousand: '.',
            postfix: '%',
        })
    });

    // Define elements for values
    var slider_second_position_behaviour_val = document.getElementById('noui-slider-second-position-val');

    // Show the values
    slider_second_position_behaviour.noUiSlider.on('update', function( values, handle ) {
        slider_second_position_behaviour_val.innerHTML = values[handle];
    });

    // Bind 3th place slider slider
    slider_second_position_behaviour.noUiSlider.on('change.one', function(val){

        var firsSliderValue = slider_winner_behaviour.noUiSlider.get().toString().slice(0, -1);
        var sliderValue = val.toString().slice(0, -1)
        var sliderDifference = 100 - firsSliderValue;

        if(sliderValue <= sliderDifference) {
            var thirdSliderValue = sliderDifference - sliderValue;
            slider_third_position_behaviour.noUiSlider.set(thirdSliderValue);
        } else {
            slider_second_position_behaviour.noUiSlider.set(100 - firsSliderValue);
            slider_third_position_behaviour.noUiSlider.set(0);
        }

    });




    //
    // Third position  behaviour
    //

    // Define element
    slider_third_position_behaviour = document.getElementById('noui-slider-third-position');

    // Create slider
    noUiSlider.create(slider_third_position_behaviour, {
        start: 10,
        behaviour: 'snap',
        connect: 'lower',
        range: {
            'min':  0,
            'max':  100
        },
        format: wNumb({
            decimals: 3,
            thousand: '.',
            postfix: '%',
        })
    });

    // Define elements for values
    var slider_third_position_behaviour_val = document.getElementById('noui-slider-third-position-val');

    // Show the values
    slider_third_position_behaviour.noUiSlider.on('update', function( values, handle ) {
        slider_third_position_behaviour_val.innerHTML = values[handle];
    });

});
