import * as d3 from "d3";

const margin = 20;

export function buildTurnoutChart(container, source) {

	const width = +container.attr("width") - 2 * margin;
	const height = +container.attr("height") - 2 * margin;

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

	const scaleTurnout = d3.scaleLinear()
							.domain([
								d3.min(data, function(d) { return d.turnout }),
								d3.max(data, function(d) { return d.turnout }),
							])
							.range([0, width]);

	const scaleYears = d3.scaleLinear()
							.domain([
								d3.min(data, function(d) { return d.year }),
								d3.max(data, function(d) { return d.year }),
							])
							.range([0, height]);

	const area = d3.area()
		.x0(function(d) { return 0; })
		.x1(function(d) { return scaleTurnout(d.turnout); })
    	.y(function(d) { return scaleYears(d.year); })
    	.curve(d3.curveBasis);

    const gradient = container
    					.append("defs")
    					.append("linearGradient")
                		.attr("id", "turnouGradient")
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

	const chart = container
						.append("g")
						.attr("class", "turnout")
						.attr("transform", `translate(${margin},${margin})`);

    chart
    	.datum(data)
    	.append("path")
    		.attr("class", "area")
    		.attr("d", area)
    		.style("fill", "url(#turnouGradient)");
}