const dateParser = d3.timeParse("%Y-%m-%d");
//d3.utcParse("%Y-%m-%d %H:%M:%S")
//d3.timeParse("%Y-%m-%d %HH:%MM:%SS");
const monthFormatter = d3.timeFormat("%B %Y");

/* Use async in order to really load and be able to filter the data */
async function loadGivt() {
    /* load data and wait for next steps, requires async overall function */
    const datasetOriginalText = await d3.text("./besmet.csv");
    var dsv = d3.dsvFormat(';'); /* format of givt csv data */
    datasetOriginal = dsv.parse(datasetOriginalText); /* parse data to dataset */
    
    /* process dates and add column to the dataset */
    datasetOriginal.forEach(function(d, i) {
        d.date = dateParser(d['Date_of_publication']);
        d.month = monthFormatter(d.date);
    });
    console.log("original dataset", datasetOriginal);
    
    /* construct new object from desired values */
    const datasetFiltered = new Object();
    
    datasetFiltered.reported = Array.from(d3.rollup(datasetOriginal, 
        v =>  d3.sum(v, d => parseFloat(d.Total_reported)), d => d.month).entries());
    datasetFiltered.deceased= Array.from(d3.rollup(datasetOriginal, 
      v =>  d3.sum(v, d => parseFloat(d.Deceased)), d => d.month).entries());

    console.log("filtered dataset", datasetFiltered);
    
    return datasetFiltered;
}

function drawGraph(svg,filteredData, color, position, maxvalue) {

    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(filteredData.map(function(d) { return d[0]; }))
      .padding(0.2);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    var y = d3.scaleLinear()
      .domain([0, maxvalue])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    svg.selectAll("mybar")
      .data(filteredData)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("width", x.bandwidth() + position)
        .attr("height", function(d) { return height - y(d[1]); })
        .attr("fill", color);
    }

var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var svg = d3.select("#wrapper")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#wrapper")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

(async () => {
   dataset = await loadGivt();
   console.log("main: ", dataset);
   drawGraph(svg,dataset.reported,'blue', 0, 750000);
   drawGraph(svg2,dataset.deceased,'red',0, 4000);
})();