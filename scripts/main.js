
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

        var years = [];
        var resultData = [];
        var candidates = [];

        data.forEach((d) => {
            years.push(d.year);
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

                    if (candidates.indexOf(c.name) < 0) {
                        candidates.push({ name: c.name })
                    }
                });
            })
        });

        years.push(2024);

        container
            .append("g").attr("class", "result-chart")
            .selectAll("circles")
            .data(resultData).enter()
            .append("circle")
            .attr("cx", function (d) { return d.position.x; })
            .attr("cy", function(d) { return d.position.y; })
            .attr("r", function (d) { return d.radius; })
            .style("fill-opacity", 0.3);

        container
            .append("g").attr("class", "year-axis")
            .call(d3.axisBottom(scaleYear)
                .tickValues(years)
                .tickFormat(function (d) { return d; }));
    })