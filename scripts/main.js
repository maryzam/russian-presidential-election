
    var svg = d3.select("svg");
    var width = +svg.attr("width"),
        height = +svg.attr("height");

    var container = svg.append("g").attr("transform", "translate(20,20)");

    var scaleVotes = d3.scaleSqrt()
        .domain([0, 100])
        .range([3, 20]);

    var chartWidth = width - 20 * 2,
        chartHeight = height - 20 * 2;

    var scaleYear = d3.scaleLinear()
        .domain([1990, 2025])
        .range([0, chartWidth]);

    var padding = 1;
    var maxRadius = 25;

    d3.json("data/data.json", function(error, data) {
        if (error) throw error;

        var resultData = [];
        var candidates = [];

        data.forEach((d) => {
            var xOffset = d.tours.length > 1 ? -maxRadius * 0.6 : 0;

            d.tours.forEach((t, i) => {
                var currHeight = 20;
                var prevRadius = 0;
                t.nominee.forEach((c, p) => {
                    var info = Object.assign({
                        year: d.year,
                        tour: i
                    }, c);

                    var radius = scaleVotes(c.votes);
                    currHeight += radius + prevRadius + padding;
                    prevRadius = radius;

                    var position = {
                        x: xOffset + scaleYear(d.year) + (info.tour * (maxRadius * 1.2)),
                        y: currHeight
                    };
                    resultData.push({
                        info: info,
                        radius: radius,
                        position: position
                    });

                    if (c.votes > 2 && candidates.indexOf(c.name) < 0) {
                        candidates.push(c.name);
                    }
                });
            })
        });

        var scaleCandidates = d3
            .scaleSequential(d3.interpolateCool)
            .domain([0, candidates.length]);

        container
            .append("g").attr("class", "result-chart")
            .selectAll("circles")
            .data(resultData).enter()
            .append("circle")
            .attr("cx", function (d) { return d.position.x; })
            .attr("cy", function(d) { return d.position.y; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function(d) { return getColor(d.info.name); });

        // build year axis
        var years = data.map((d) => d.year);

        var periods = data.map((d) => {
            var lastTour = d.tours.length - 1;
            // assume that we've already had sorted data here
            var president = d.tours[lastTour].nominee[0].name; 
            return {
                start: d.year,
                end: d.next,
                president: president
            };
        });

        periods.unshift({
            start: periods[0].start - 1,
            end: periods[0].start
        });

        var lastYear = periods[(periods.length - 1)].end;
        years.push(lastYear);

        periods.push({
            start: lastYear,
            end: lastYear + 1
        })

        var timeline = container
            .append("g").attr("class", "year-axis");

        timeline
            .selectAll("rect")
            .data(periods).enter()
            .append("rect")
            .attr("x", function (d) { return scaleYear(d.start); })
            .attr("width", function(d) {
                return scaleYear(d.end) - scaleYear(d.start);
            })
            .attr("y", 0)
            .attr("height", 10)
            .style("fill", function(d) {
                return getColor(d.president);
            });

        function getColor(name) {
            var id = candidates.indexOf(name);
            if (id === -1) {
                return "grey";
            }
            return scaleCandidates(id);
        }
    })