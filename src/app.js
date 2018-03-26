import * as d3 from "d3";
import { buildTurnoutChart } from "./charts/turnout"

d3.json("data/data.json")
	.then(function(data) {

		const mainContainer = d3.select("#main-chart");
		buildTurnoutChart(mainContainer, data);
	})