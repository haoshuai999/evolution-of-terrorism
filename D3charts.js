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
				.transition()		
				.duration(200)
				.attr("fill", function(data,i) {
					return colorfill[i]
				})

			d3.select(".sticky1").selectAll("path")
				.on("mouseover",function(d,i){
					div.transition()		
						.duration(250)		
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
	var width = 950,
		height = 700;

	var svg = d3.select(".sticky1").append("svg")
	  .attr("width", width)
	  .attr("height", height);

	// Add background
	// svg.append('rect')
	//   .style("fill", "#000")
	//   .attr('width', width)
	//   .attr('height', height);

	var g = svg.append('g');

	var xym = d3.geo.equirectangular()
						.center([10,41])
						.scale(150)
						.translate([width/2, (height-100)/3]);
	var path = d3.geo.path().projection(xym);

	// Customize the projection to make the center of Thailand become the center of the map



	d3.json("https://gist.githubusercontent.com/haoshuai999/6648576cf22f9696805bd0436c6bd0fe/raw/0a9598b48a4314b2e53b29e0e434c14dc993c235/worldrough.geo.json", function(data) {
		var attacks = processcsv(data.features,decade)


		g.selectAll("path").data(data.features)
		.enter().append("path")
		.transition()
		.duration(200)
		.attr("d", path)
		.attr('vector-effect', 'non-scaling-stroke')
		.attr("stroke", "white")
	  
	});

	var allcolor = ["#000","#ffbaba","#ff7b7b","#ff5252","#ff0000","#a70000"]
	var attach_num = ["No records","0-100","100-1000","1000-2000","2000-5000",">5000"]

	svg.append('text')
		.transition()
		.duration(600)
        .attr("x", width * 0.25)
        .attr("y", 30)
		.text("Timeline of attacks (1970-2017)")
        .style("fill","#fff")
	    .style("font-size","20px")

	svg.append('text')
		.transition()
		.duration(600)
        .attr("x", width * 0.02)
        .attr("y", 70)
        .text("Number of Attacks:")
        .style("fill","#fff")
	    .style("font-size","10px")

    for (var i = 0; i < attach_num.length; i++) {
	    svg.append('rect')
	    	.transition()
			.duration(600)
	        .attr("x", width * (0.8 - 0.12 * i))
	        .attr("y", 60)
	        .attr("width", 10)
	        .attr("height", 10)
	        .style("stroke","white")
	        .style("stroke-width","1px")
	        .style("fill", function (d) {
	            return allcolor[i]
	        })
	    
	    svg.append('text')
	    	.transition()
			.duration(600)
	        .attr("x", width * (0.82 - 0.12 * i))
	        .attr("y", 70)
	        .style("fill","#fff")
	        .style("font-size","10px")
	    //.attr("dy", ".35em")
	        .text(function (d) {
	            return attach_num[i]
	        })
	}

}
function drawline(data){
	//Get width of page
	var chartwidth = parseInt(d3.select(".sticky2").style("width")) * 0.9;
	
	// Set the margins
	var margin = {top: 60, right: 15, bottom: 60, left: 100},
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
	var color = d3.scale.ordinal().range(["#FF0000", "#FFFF00"]);
	
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
	
	 svg.append('text')
		.transition()
		.duration(600)
        .attr("x", width * 0.3)
        .attr("y", -40)
        .text("Deadliest Attacks (1970-2017)")
        .style("fill","#fff")
	    .style("font-size","20px")

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
		  .style("fill", "#aaa")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text") 
		  .attr("y", 40) 
		  .attr("x", width/2 ) //place the year label in the middle of the axis
		  .attr("dx", ".71em") 
		  .style("text-anchor", "end")
		  .style("fill", "#aaa")
		  .text("Year");
	
		// append the yAxis and add label as before.
	  svg.append("g")
		  .attr("class", "y axis")
		  .style("fill", "#aaa")
		  .attr("id", "#yAxis")
		  .call(yAxis)
		.append("text")
		  .attr("y", -10)
		  .attr("x", 0)
		  .attr("dy", ".71em")
		  .style("text-anchor", "start")
		  .style("fill", "#aaa")
		  .text("Percentage");
	  
		  //draw the legend
	if(projections.length == 2){
		for (var i = 0; i < projections.length; i++) {
	        svg.append('rect')
	        	.data(projections)
	            .attr("x", width * (0.8 - 0.22 * i))
	            .attr("y", -10)
	            .attr("width", 10)
	            .attr("height", 10)
	            .style("fill", function (d) {
		            return color(i)
		        })
	        
	        svg.append('text')
	            .attr("x", width * (0.82 - 0.22 * i))
	            .attr("y", 0)
	            .style("fill","#aaa")
	            .style("font-size","10px")
	        //.attr("dy", ".35em")
		        .text(function (d) {
		            return projections[i].name
		        })
        }
	}
    else if(projections.length == 1){
    	svg.append('rect')
	        	.data(projections)
	            .attr("x", width * 0.75)
	            .attr("y", -10)
	            .attr("width", 10)
	            .attr("height", 10)
	            .style("fill", function (d,i) {
		            return color(d.name)
		        })
	        
	        svg.append('text')
	            .attr("x", width * 0.77)
	            .attr("y", 0)
	            .style("fill","#aaa")
	            .style("font-size","10px")
	        //.attr("dy", ".35em")
		        .text(function (d) {
		            return projections[0].name
		        })
    }   


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

	d3.selectAll(".line").style("opacity","0.9");

	
	//Select All of the lines and process them one by one
	d3.selectAll(".line").each(function(d,i){

	// Get the length of each line in turn

	var totalLength = d3.select("#line" + i).node().getTotalLength();


	d3.selectAll("#line" + i)
	  .attr("stroke-dasharray", totalLength + " " + totalLength)
	  .attr("stroke-dashoffset", totalLength)
	  .transition()
	  .duration(2500)
	  .delay(10*i)
	  .ease("quad") //Try linear, quad, bounce... see other examples here - http://bl.ocks.org/hunzy/9929724
	  .attr("stroke-dashoffset", 0)
	  .style("stroke-width",3)
	})		 
			 
};

var Data_url = 'https://gist.githubusercontent.com/kishansheth/8e8b21acf9017aeb2cf3fff7c0682f8e/raw/de604427f0cb5a3e10a3f65be4db27de8d9e0f21/scatterplot_data.json';

function changebubblechart(slide) {
	var w = 950,
	h = 500,
	pad = 40,
	left_pad = 240;

	var svg = d3.select(".sticky3 svg");

	// Define the div for the tooltip
	var div = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0);

	d3.json(Data_url, function (punchcard_data) {
		var x = d3.scale.linear().domain([0, 47]).range([left_pad, w-pad]),
		y = d3.scale.linear().domain([0, 12]).range([pad, h-pad*2]);

			var dots = svg.selectAll(".circle")
			.data(punchcard_data)
			.style('fill', function (d) {
				if (slide == 5) {
					return "red";
				}
				if (slide == 6) {
					if (d[2] > 225) {
						return "red";
					}
				}
				if (slide == 7) {
					if ( d[0] == 2 && parseInt(d[1]) > 1980 && parseInt(d[1]) < 1990) {
						//console.log(slide, d);
						return "red";
					}
				}
				if (slide == 8) {
					if (d[3].toLowerCase().includes("hutu") || d[3].toLowerCase().includes("tutsi")) {
						//console.log(slide, d);
						return "red";
					}
				}
				if (slide == 9) {
					if (d[1] == "2001-09-11") {
						return "red";
					}
				}
				if (slide == 10) {
					if (d[0] == 10 && d[3].toLowerCase().includes("isil")) {
						return "red";
					}
				}
				// else if (currentSlide == 1) {
				// 	if 
				// }
				// else if () {}
				// else if () {}
				// else if () {}
				// else {}
			});

			dots.on("mouseover", function(d, i) {		
				d3.select(this).style({
					stroke: "white"
					});
				div.transition()		
					.duration(200)		
					.style("opacity", .9);
				div	.html(
					"Group: " + d[3] + "<br/>" 
					+ "Country: " + d[4] + "<br/>" 
					+ "Fatalities: " + parseInt(d[2]) + "<br/>"
					+ "Date: " + d[1])	
					.style("left", (d3.event.pageX - 0) + "px")		
					.style("top", (d3.event.pageY - 0) + "px");
			})							
			.on("mouseout", function(d, i) {
				d3.select(this).style({
					stroke: "#555"
				});		
				div.transition()		
					.duration(500)		
					.style("opacity", 0);	
			});

			// .style('opacity', 1);

		// dots.transition()
		// 	.duration(1000)
		// 	.style('opacity', 1);
	});
}

function showbubblechart(slide){
	
	var w = 950,
	h = 500,
	pad = 40,
	left_pad = 240;

	var svg = d3.select(".sticky3")
			.append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
    		.attr("transform", "translate(0,40)");
	 
	var x = d3.scale.linear().domain([0, 48]).range([left_pad, w-pad]),
		y = d3.scale.linear().domain([0, 12]).range([pad, h-pad*2]);
	 
	var xAxis = d3.svg.axis().scale(x).orient("bottom")
			.ticks(49)
			.tickFormat(function (d, i) {
				if (d%5 == 0) {
					return d+1970;
				}
				else {
					return "";
				}
			})
		yAxis = d3.svg.axis().scale(y).orient("left")
			.ticks(12)
			.tickFormat(function (d, i) {
				return ['North America', 'Central America & Caribbean', 'South America', 'East Asia', 'Southeast Asia', 'South Asia', 'Central Asia', 'Western Europe', 'Eastern Europe', 'Middle East & North Africa', 'Sub-Saharan Africa', 'Australasia & Oceania'][d];
			});


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

	svg.append('text')
		.transition()
		.duration(600)
        .attr("x", w * 0.4)
        .attr("y", -20)
        .text("Deadliest Attacks (1970-2017)")
        .style("fill","#fff")
	    .style("font-size","20px")
	
	d3.json(Data_url, function (punchcard_data) {
		var max_r = d3.max(punchcard_data.map(
						function (d) { return d[2]; })),
			r = d3.scale.linear()
				.domain([0, d3.max(punchcard_data, function (d) { return d[2]; })])
				.range([1.5, 30]);

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

			dots.transition()
				.duration(500)
				.style('opacity', 1);
			
			
	});
	
}

// using d3 for convenience
var main = d3.select('main');
var scrolly = main.select('#scrolly');
var figure1 = scrolly.select('.sticky1');
var figure2 = scrolly.select('.sticky2');
var figure3 = scrolly.select('.sticky3');
var article1 = scrolly.select('.scroll1');
var article2 = scrolly.select('.scroll2');
var article3 = scrolly.select('.scroll3');
var step1 = article1.selectAll('.step');
var step2 = article2.selectAll('.step');
var step3 = article3.selectAll('.step');
var prelong = article3.selectAll('.prelong');
var step = scrolly.selectAll('.step');
var url0 = "https://gist.githubusercontent.com/haoshuai999/dbe67bcac6101074962a2de18298466c/raw/1198a8db6eab55799c628ab2519725be5ac55fbf/data.csv"
var url1 = "https://gist.githubusercontent.com/haoshuai999/cfb02118786cf52476da5d0983e3ebe6/raw/c27f22fad874cfa93175a6ad1df48e0f070f28c4/allweapons.csv"
var url2 = "https://gist.githubusercontent.com/haoshuai999/61390fedd6e351449d70b2a8b6dc7ace/raw/4ffccc0931a80863c604afc6ceb3a24fff7e3016/explosives.csv"
var url3 = "https://gist.githubusercontent.com/haoshuai999/61480128cffc7a68391aea03b7a54f6e/raw/b85434e519952fa826f088df388478b52efd6d1d/firearms.csv"


// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
	// 1. update height of step elements
	var scrollyWidth = window.innerWidth * 0.98

	scrolly
		.style('width', scrollyWidth + 'px')

	var stepH = Math.floor(window.innerHeight * 0.75);
	var longstep = window.innerHeight * 2.5
	step1.style('height', stepH + 'px');
	step2.style('height', stepH + 'px');
	step3.style('height', stepH + 'px');
	prelong.style('height', longstep + 'px');

	var figureHeight = window.innerHeight / 1.2
	var figureMarginTop = (window.innerHeight - figureHeight) / 2  

	figure1
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	figure2
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	figure3
		.style('height', figureHeight + 'px')
		.style('top', figureMarginTop + 'px');

	// 3. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {

	if (response.direction == 'up' && response.index == 4){
		d3.select('.sticky1 svg').remove();
		worldmap();
	}
	if (response.direction == 'down' && response.index <= 4){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1);
	}
	if (response.direction == 'up' && response.index <= 4){
		d3.select('.tooltip').remove();
		changecolor(response.index + 1);
	}
	if (response.direction == 'down' && response.index == 5){
		d3.select('.sticky1 svg').remove();
		d3.select('.sticky3 svg').remove();
		d3.select('.tooltip').remove();
		showbubblechart();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 5){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 6){
		d3.select('.sticky1 svg').remove();
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 6){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 7){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 7){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 8){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 8){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 9){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 9){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 10){
		d3.select('.tooltip').remove();
		changebubblechart(response.index);
	}
	if (response.direction == 'up' && response.index == 10){
		d3.select('.tooltip').remove();
		showbubblechart();
		changebubblechart(response.index);
	}
	if (response.direction == 'down' && response.index == 11){
		d3.select('.sticky2 svg').remove();
		d3.select('.sticky3 svg').remove();
		showlinechart(url0);
	}
	if (response.direction == 'up' && response.index == 11){
		d3.select('.sticky2 svg').remove();
		showlinechart(url0);
	}
	if (response.direction == 'down' && response.index == 12) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url1);
	}
	if (response.direction == 'up' && response.index == 12) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url1);
	}
	if (response.direction == 'down' && response.index == 13) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url2);
	}
	if (response.direction == 'up' && response.index == 13) {
		d3.select('.sticky2 svg').remove();
		showlinechart(url2);
	}
	if (response.direction == 'down' && response.index == 14) {
		d3.select('.sticky2 svg').remove();	
		showlinechart(url3);
	}
	if (response.direction == 'up' && response.index == 14) {
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
		offset: 0.5,
		//debug: true,
	})
		.onStepEnter(handleStepEnter)

	// setup resize event
	window.addEventListener('resize', handleResize);
	worldmap();
}

// kick things off
init();