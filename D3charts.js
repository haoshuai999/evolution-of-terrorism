var savematch = []
function processcsv(features,decade){
	d3.csv("https://gist.githubusercontent.com/haoshuai999/fcc38f23dba68f889cf7fc34c131d6c4/raw/3ef832b6c24750e453b74a9359a50322343ccdfb/nattacks.csv", function(attackdata) {
		for (var i = 0; i < features.length; i++) {
			for (var j = 0; j < attackdata.length; j++) {
				if(features[i].properties.name==attackdata[j].country){
					savematch.push([i,j])
				}
			}
		}
	})
};
function changecolor(decade){

	var div = d3.select("body").append("div")	
			.attr("class", "tooltip")			
			.style("opacity", 0);


	d3.csv("https://gist.githubusercontent.com/haoshuai999/fcc38f23dba68f889cf7fc34c131d6c4/raw/3ef832b6c24750e453b74a9359a50322343ccdfb/nattacks.csv", function(attackdata) {
		d3.json("https://gist.githubusercontent.com/haoshuai999/6648576cf22f9696805bd0436c6bd0fe/raw/0a9598b48a4314b2e53b29e0e434c14dc993c235/worldrough.geo.json", function(data) {
			colorfill = []
			num_of_attack = []
			for(var k = 0; k < savematch.length; k++){
				i = savematch[k][0]
				j = savematch[k][1]
				if(attackdata[j].decade == decade){
					if(attackdata[j].decade == decade){
						num_of_attack[i] = attackdata[j].nattack
					}
					if(parseInt(attackdata[j].nattack) > 5000 ){
						colorfill[i]="#a70000"
					}
					else if(parseInt(attackdata[j].nattack) > 2000 && parseInt(attackdata[j].nattack) <= 5000){
						colorfill[i]="#ff0000"
					}
					else if(parseInt(attackdata[j].nattack) > 1000 && parseInt(attackdata[j].nattack) <= 2000){
						colorfill[i]="#ff5252"
					}
					else if(parseInt(attackdata[j].nattack) > 100 && parseInt(attackdata[j].nattack) <= 1000){
						colorfill[i]="#ff7b7b"
					}
					else if(parseInt(attackdata[j].nattack) >= 0 && parseInt(attackdata[j].nattack) <= 100){
						colorfill[i]="#ffbaba"
					}
				}
			}
			d3.select(".sticky1").selectAll("path")
				.attr("fill", function(data,i) {
					return colorfill[i]
				})
				.attr("stroke", "white")
				.on("mouseover",function(d,i){
					div.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div.html(data.features[i].properties.name + ": " + num_of_attack[i])	
						.style("left", (d3.event.pageX) + "px")		
						.style("top", (d3.event.pageY - 28) + "px");			
				})
				.on("mouseout",function(d,i){
					div.transition()		
						.duration(500)		
						.style("opacity", 0);	
				})
		})
	})
}
function worldmap(decade){
	var width = 1060,
		  height = 521;

	var svg = d3.select(".sticky1").append("svg")
	  .attr("width", width)
	  .attr("height", height);

	// Add background
	svg.append('rect')
	  .style("fill", "#000")
	  .attr('width', width)
	  .attr('height', height);

	var g = svg.append('g');

	var xym = d3.geo.mercator()
						.center([10,41])
						.scale(150)
						.translate([width/2, height/2]);
	var path = d3.geo.path().projection(xym);

	// Customize the projection to make the center of Thailand become the center of the map



	d3.json("https://gist.githubusercontent.com/haoshuai999/6648576cf22f9696805bd0436c6bd0fe/raw/0a9598b48a4314b2e53b29e0e434c14dc993c235/worldrough.geo.json", function(data) {
		var attacks = processcsv(data.features,decade)

		setTimeout(function(){
			g.selectAll("path").data(data.features)
			.enter().append("path")
			.attr("d", path)
			.attr('vector-effect', 'non-scaling-stroke')
		}, 1500)
	  
	});

}
function drawline(data){
	//Get width of page
	var chartwidth = parseInt(d3.select(".sticky2").style("width")) * 0.9;
	
	// Set the margins
	var margin = {top: 20, right: 15, bottom: 60, left: 100},
		width = chartwidth - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	
	// Set up the format to match that of the data that is being read in - have a look here for a list of formats - https://github.com/mbostock/d3/wiki/Time-Formatting
	var parseDate = d3.time.format("%Y").parse;
	
	// Setting up the scaling objects		
	var x = d3.time.scale()
		.range([0, width]);
	
	// Same for the y axis
	var y = d3.scale.linear()
		.range([height, 0]);
	
	// Same for colour.
	var color = d3.scale.category10();
	
	//Setting x-axis up here using x scaling object
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
	
	//Setting y-axis up here using y scaling object
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickSize(-width);
		
	// Setting up a d3 line object - used to draw lines later
	var line = d3.svg.line() 
		.x(function(d) { return x(d.date); }) 
		.y(function(d) { return y(d.population); });
	
	
	// Now to actually make the chart area
	var svg = d3.select(".sticky2").append("svg")
		.attr("class", "svgele") 
		.attr("id", "svgEle")  
		.attr("width", width + margin.left + margin.right) 
		.attr("height", height + margin.top + margin.bottom)
	  .append("g") 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	 
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
			  
	  // Take each row and put the date column through the parsedate form we've defined above.	
	  data.forEach(function(d) {
		d.date = parseDate(d.date);
	  });
	
	  // Building an object with all the data in it for each line
	  projections = color.domain().map(function(name) {
		return {
		  name: name,
		  values: data.map(function(d) {
			return {date: d.date, population: +d[name]};
			 })
		};
	  });
	  
	  // Set the domain of the x-value
	  x.domain(d3.extent(data, function(d) { return d.date; }));
	
	  // Do the same for the y-axis...[0,800000] by looking at the minimum and maximum for the population variable.
	  y.domain([
		d3.min(projections, function(c) { return d3.min(c.values, function(v) { return v.population; }); }),
		d3.max(projections, function(c) { return d3.max(c.values, function(v) { return v.population; }); })
	  ]);
	  
	  
	  
	  // Bind the x-axis to the svg object
	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text") 
		  .attr("y", 40) 
		  .attr("x", width/2 ) //place the year label in the middle of the axis
		  .attr("dx", ".71em") 
		  .style("text-anchor", "end")
		  .text("Year");
	
		// append the yAxis and add label as before.
	  svg.append("g")
		  .attr("class", "y axis")
		  .attr("id", "#yAxis")
		  .call(yAxis)
		.append("text")
		  .attr("y", 0)
		  .attr("x", 0)
		  .attr("dy", ".71em")
		  .style("text-anchor", "start")
		  .text("Percentage");
	  

		//create proj
		var proj = svg.selectAll(".proj")
				.data(projections)
				.enter()
				.append("g")
				.attr("class", "proj");
		
		// Drawing the lines
			proj.append("path")
				.attr("class", "line")
				.attr("id" , function(d, i){
					return "line" + i;
				})
				.attr("stroke-linecap","round")
			  .attr("d", function(d,i) {
				  return line(d.values);
				 })
			  .style("stroke", function(d) { return color(d.name); });
			
		//Initially set the lines to not show	
		 d3.selectAll(".line").style("opacity","0");

		 //Draw all lines onload
		animatelines();
}
function showlinechart(url){
	// Load in the data now...
	
	d3.csv(url, function(error, data) {

		drawline(data);

	})
};
function animatelines(){

	d3.selectAll(".line").style("opacity","0.5");

	
	//Select All of the lines and process them one by one
	d3.selectAll(".line").each(function(d,i){

	// Get the length of each line in turn
	var totalLength = d3.select("#line" + i).node().getTotalLength();

		d3.selectAll("#line" + i)
		  .attr("stroke-dasharray", totalLength + " " + totalLength)
		  .attr("stroke-dashoffset", totalLength)
		  .transition()
		  .duration(5000)
		  .delay(100*i)
		  .ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
		  .attr("stroke-dashoffset", 0)
		  .style("stroke-width",3)
	})		 
			 
};
function showbubblechart(){
	var w = 1000,
	h = 500,
	pad = 40,
	left_pad = 250,
	Data_url = '/data.json';

	var svg = d3.select(".sticky1")
			.append("svg")
			.attr("width", w)
			.attr("height", h);
	 
	var x = d3.scale.linear().domain([0, 47]).range([left_pad, w-pad]),
		y = d3.scale.linear().domain([0, 12]).range([pad, h-pad*2]);
	 
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
			.ticks(48)
			.tickFormat(function (d, i) {
				return d+1970;
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
		.transition()
		.duration(1000)
	.selectAll("text")
		.attr("transform", "rotate(90)translate(25,-13)")
		.style("fill", "#aaa");
	 
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+(left_pad-pad)+", 0)")
		.call(yAxis)
		.transition()
		.duration(1000)
	.selectAll("text")
		.style("fill", "#aaa");
	 
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
				.range([1, 30]);
	 
		svg.selectAll(".loading").remove();
	 
		var dots = svg.selectAll("circle")
			.data(punchcard_data)
			.enter()
			.append("circle")
			.attr("class", "circle")
			// .style("fill", function(d) { return "black"/*regionColors[d[0]]*/; })
			.attr("cx", function (d) { 
				return x( parseInt(d[1]) + ((parseInt(d[1].substring(5, 7))-1)/12) /*+ (parseInt(d[1].substring(8, 9))/31)*/ - 1970 );
			})
			.attr("cy", function (d) { return y(d[0] - 1); })
			.attr("r", function (d) { return r(d[2]); })
			.style('opacity', 0);

		dots.transition()
			.duration(1000)
			.style('opacity', 1);
		
		dots.on("mouseover", function(d, i) {		
				d3.select(this).style({
					fill: "white"
					});
				div.transition()		
					.duration(200)		
					.style("opacity", .9);
				div	.html("Group: " + d[3] + "<br/>" + "Country: " + d[4] + "<br/>" + "Fatalities: " + parseInt(d[3]))	
					.style("left", (d3.event.pageX - 0) + "px")		
					.style("top", (d3.event.pageY - 0) + "px");
			})							
			.on("mouseout", function(d, i) {
				d3.select(this).style({
					fill: "black"
				  });		
				div.transition()		
					.duration(500)		
					.style("opacity", 0);	
			});
	});
}

// using d3 for convenience
var main = d3.select('main');
var scrolly = main.select('#scrolly');
var figure1 = scrolly.select('.sticky1');
var figure2 = scrolly.select('.sticky2');
var article1 = scrolly.select('.scroll1');
var article2 = scrolly.select('.scroll2');
var step1 = article1.selectAll('.step');
var step2 = article2.selectAll('.step');
var step = scrolly.selectAll('.step');
var url0 = "https://gist.githubusercontent.com/haoshuai999/dbe67bcac6101074962a2de18298466c/raw/d56fe7857463c1d86989ad078a7e7db8927c8ca7/data.csv"
var url1 = "https://gist.githubusercontent.com/haoshuai999/cfb02118786cf52476da5d0983e3ebe6/raw/bc6d825ef2e71d3559ae23023d387bd896ddf1c8/allweapons.csv"
var url2 = "https://gist.githubusercontent.com/haoshuai999/61390fedd6e351449d70b2a8b6dc7ace/raw/883a08e21ff297097598fbfc58eda610b901123c/explosives.csv"
var url3 = "https://gist.githubusercontent.com/haoshuai999/61480128cffc7a68391aea03b7a54f6e/raw/13de4768250360561e6668a87775eb15e06eda6f/firearms.csv"


// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var scrollyWidth = window.innerWidth * 0.98

	scrolly
		.style('width', scrollyWidth + 'px')

	var stepH = Math.floor(window.innerHeight * 0.75);
	step1.style('height', stepH + 'px');
	step2.style('height', stepH + 'px');

	var figureHeight = window.innerHeight / 1.2
	var figureMarginTop = (window.innerHeight - figureHeight) / 2  

	figure1
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	figure2
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
	//console.log(response)
	// response = { element, direction, index }
	// add color to current step only
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})
	// step2.classed('is-active', function (d, i) {
	// 	return i === response.index;
	// })

	// update graphic based on step
	figure1.select('p').text(response.index);
	figure2.select('p').text(response.index);

	//console.log(response.index)
	if (response.direction == 'down' && response.index < 5){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1);
	}
	else if (response.direction == 'up' && response.index == 4){
		d3.select('.sticky1 svg').remove();
		worldmap();
	}
	else if (response.direction == 'up' && response.index < 5){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1);
	}
	else if (response.direction == 'down' && response.index >= 5 && response.index < 12){
		d3.select('.sticky1 svg').remove();
		d3.select('.tooltip').remove();
		showbubblechart();
	}
	else if (response.direction == 'up' && response.index >= 5 && response.index < 12){
		d3.select('.sticky1 svg').remove();
		d3.select('.tooltip').remove();
		showbubblechart();
	}
	else if (response.direction == 'down' && response.index == 12){
		d3.select('.sticky2 svg').remove();
		showlinechart(url0);
	}
	else if (response.direction == 'up' && response.index == 12){
		d3.select('.sticky2 svg').remove();
		showlinechart(url0);
	}
	else if (response.direction == 'down' && response.index == 13) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url1);
	}
	else if (response.direction == 'up' && response.index == 13) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url1);
	}
	else if (response.direction == 'down' && response.index == 14) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url2);
	}
	else if (response.direction == 'up' && response.index == 14) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url2);
	}
	else if (response.direction == 'down' && response.index == 15) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url3);
	}
	else if (response.direction == 'up' && response.index == 15) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url3);
	}

}

function setupStickyfill() {
	d3.selectAll('.sticky').each(function () {
		Stickyfill.add(this);
	});
}

function init() {
	setupStickyfill();

	// 1. force a resize on load to ensure proper dimensions are sent to scrollama
	handleResize();

	// 2. setup the scroller passing options
	// 		this will also initialize trigger observations
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller.setup({
		step: '#scrolly article .step',
		offset: 0.40,
		debug: true,
	})
		.onStepEnter(handleStepEnter)

	// setup resize event
	window.addEventListener('resize', handleResize);
	worldmap();
}

// kick things off
init();