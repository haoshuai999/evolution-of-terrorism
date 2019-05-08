var w = 1200,
    h = 600,
    pad = 40,
    left_pad = 250,
    Data_url = '/data.json';

var svg = d3.select("#punchcard")
        .append("svg")
        .attr("width", w)
        .attr("height", h);
 
var x = d3.scale.linear().domain([0, 47]).range([left_pad, w-pad]),
    y = d3.scale.linear().domain([0, 12]).range([pad, h-pad*2]);
 
var xAxis = d3.svg.axis().scale(x).orient("bottom")
        .ticks(48)
        .tickFormat(function (d, i) {
            if (d%5 == 0) {
                return d+1970;
            }
        })
    yAxis = d3.svg.axis().scale(y).orient("left")
        .ticks(12)
        .tickFormat(function (d, i) {
            return ['North America', 'Central America & Caribbean', 'South America', 'East Asia', 'Southeast Asia', 'South Asia', 'Central Asia', 'Western Europe', 'Eastern Europe', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Australasia & Oceania'][d];
        });

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad-40)+")")
    .call(xAxis)
.selectAll("text")
    .attr("transform", "rotate(90)translate(20,-10)");
 
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate("+(left_pad-pad)+", 0)")
    .call(yAxis);
 
svg.append("text")
    .attr("class", "loading")
    .text("Loading ...")
    .attr("x", function () { return w/2; })
    .attr("y", function () { return h/2-5; });
 
d3.json('https://gist.githubusercontent.com/kishansheth/8e8b21acf9017aeb2cf3fff7c0682f8e/raw/de604427f0cb5a3e10a3f65be4db27de8d9e0f21/scatterplot_data.json', function (punchcard_data) {
    var max_r = d3.max(punchcard_data.map(
                       function (d) { return d[2]; })),
        r = d3.scale.linear()
            .domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
            .range([1.5, 25]);
 
    svg.selectAll(".loading").remove();
 
    svg.selectAll("circle")
        .data(punchcard_data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        // .style("fill", function(d) { return "black"/*regionColors[d[0]]*/; })
        .attr("cx", function (d) { 
            console.log("year: " + parseInt(d[1]));
            console.log("full date: " + d[1]);
            console.log("month from json: " + d[1].substring(5,6));
            console.log("month: " + parseInt(d[1].substring(5, 6)));
            console.log("month fraction: " + parseInt(d[1].substring(5, 6))/12);

            return x( parseInt(d[1]) + ((parseInt(d[1].substring(5, 7))-1)/12) /*+ (parseInt(d[1].substring(8, 9))/31)*/ - 1970 );
        })
        .attr("cy", function (d) { return y(d[0] - 1); })
        // .transition()
        // .duration(1600)
        .attr("r", function (d) { return r(d[2]); })
        .on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", .9);		
            div	.html(d[1] + "<br/>"  + d[3])	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });
});

function handleMouseOver(d, i) {  // Add interactivity

    // Use D3 to select element, change color and size
    d3.select(this).style({
      fill: "orange"
    });
  }

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    d3.select(this).style({
      fill: "black"
    });
  }