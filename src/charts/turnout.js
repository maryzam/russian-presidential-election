import * as d3 from "d3";

const margin = 20;

export function buildTurnoutChart(container, source) {

	const width = +container.attr("width") - 2 * margin;
	const height = +container.attr("height") - 2 * margin;
	const data = prepareData(source);

	const scaleYears = d3.scaleLinear()
							.domain([
								d3.min(data, function(d) { return d.year }),
								d3.max(data, function(d) { return d.year }),
							])
							.range([0, height]);

	const scaleTurnout = d3.scaleLinear()
							.domain([
								Math.min(55, d3.min(data, function(d) { return d.turnout })),
								d3.max(data, function(d) { return d.turnout }),
							])
							.range([0, width]);

	console.log(scaleYears);
	console.log(scaleTurnout);
	buildChart(container, data, scaleYears, scaleTurnout);
	buildTimeline(container, data, scaleYears);
}

function prepareData(source) {
	const data = source.map((d) => {
		return {
			year: d.year,
			turnout: d.tours[0].turnout
		};
	});

	const first = data[0];
	const last = data[(data.length - 1)];
	data.unshift({ 
		year: (first.year - 2), 
		turnout: first.turnout
	});
	data.push({
		year: (last.year + 2), 
		turnout: last.turnout
	});

	return data;
};

function buildChart(container, data, scaleYears, scaleTurnout) {
	const chart = container
						.append("g")
						.attr("class", "turnout")
						.attr("transform", `translate(${margin},${margin})`);

	const area = d3.area()
		.x0(function(d) { return 0; })
		.x1(function(d) { return scaleTurnout(d.turnout); })
    	.y(function(d) { return scaleYears(d.year); })
    	.curve(d3.curveBasis);

	const gradient = getGradient(container, "turnouGradient");

	chart
    	.datum(data)
    	.append("path")
    		.attr("class", "area")
    		.attr("d", area)
    		.style("fill", gradient)
    		.style("fill-opacity", 0.7);
};

function buildTimeline(container, data, scaleYears) {
	const chart = container
					.append("g")
					.attr("class", "timeline")
					.attr("transform", `translate(${(2 * margin)},${(margin)})`);

	const years = data.map(x => x.year).slice(1, (data.length - 1));
	const timeline = chart.append("g").attr("class", "timeline");

	timeline
		.append("line")
		.attr("y1", scaleYears.range()[0])
		.attr("y2", scaleYears.range()[1])
		.style("stroke", "grey");

	const ticks = timeline
		.selectAll("g")
		.data(years).enter()
		.append("g")
		.attr("transform", function(d) { return `translate(0, ${scaleYears(d)})`; });

	ticks
		.append("circle")
		.attr("r", 5)
		.style("fill" , "black")	
		.style("stroke" , "white");	

	ticks
		.append("text")
		.attr("x", 10)
		.attr("y", 10)
		.text(function (d) { return d; })
		.style("font-family", "monospace")
		.style("font-size", "20px");
};


function getGradient(container, gradientId) {
	let defs = container.select("defs");
	if (!defs.nodes().length) {
		defs = container.append("defs");
	}
	const gradient = defs
    					.append("defs")
    					.append("linearGradient")
                		.attr("id", gradientId)
                		.attr("x1", "0%")
					    .attr("y1", "0%")
					    .attr("x2", "0%")
					    .attr("y2", "100%");;

    gradient.append('stop')
                .attr("offset", "0%")
    			.attr("stop-color", "white");

    gradient.append('stop')
    	        .attr("offset", "10%")
    			.attr("stop-color", "#999");
    
    gradient.append('stop')
    	        .attr("offset", "90%")
    			.attr("stop-color", "#999");
		
	gradient.append('stop')
    	        .attr("offset", "100%")
    			.attr("stop-color", "white");

    return `url(#${gradientId})`;
};