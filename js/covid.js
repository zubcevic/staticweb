async function drawLineChart() {

    //d3.select("#wrapper");
    d3.selectAll("svg").remove();

    //1. Load your Dataset
    const datasetOriginal = await d3.csv("./covid19.csv");
    //const datasetOriginal = await d3.csv("https://www.zubcevic.com/covid19.csv");
  
  
    const selectedDataColumn = 'kliniek_bezetting_covid'; //'IC_Bedden_COVID';
    const nonCovidBeds = 'IC_bezetting_noncovid';
    const covidBeds = 'IC_bezetting_covid';
    const covidBedsNew = 'IC_bezetting_covid_internationaal';
    const yAccessor = (d) => d[selectedDataColumn];
    const yAccessor2 = (d) => d[covidBeds];
    const yAccessor3 = (d) => d[nonCovidBeds];
    const dateParser = d3.timeParse("%d-%m-%Y");
    const xAccessor = (d) => dateParser(d["datum"]);
    console.log("loaded covid data",datasetOriginal);
  
    const dataset = datasetOriginal.filter(function(d){
          if(isNaN(d[selectedDataColumn]) || isNaN(d[covidBeds]) || isNaN(d[covidBedsNew]) || isNaN(d[nonCovidBeds])){
              return false;
          }
          d[selectedDataColumn] = parseInt(d[selectedDataColumn], 10);
          d[covidBeds] = parseInt(d[covidBeds], 10);
          d[nonCovidBeds] = parseInt(d[nonCovidBeds], 10);
          d[covidBedsNew] = parseInt(d[covidBedsNew], 10);
          return true;
      });
  
    // 2. Create a chart dimension by defining the size of the Wrapper and Margin
  
    let dimensions = {
      width: window.innerWidth  * 0.6 ,
      height: 600,
      margin: {
        top: 115,
        right: 20,
        bottom: 40,
        left: 60,
      },
    };
    dimensions.boundedWidth =
      dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight =
      dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
  
    // 3. Draw Canvas
  
    const wrapper = d3
      .select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);
  
    //Log our new Wrapper Variable to the console to see what it looks like
    //console.log(wrapper);
  
    // 4. Create a Bounding Box
  
    const bounds = wrapper
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px,${dimensions.margin.top}px)`
      );
  
    // 5. Define Domain and Range for Scales
  
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, yAccessor))
      .range([dimensions.boundedHeight, 0]);
  
    // console.log(yScale(100));
    const referenceBandPlacement = yScale(dataset[0][selectedDataColumn]);
    const referenceBand = bounds
      .append("rect")
      .attr("x", 0)
      .attr("width", dimensions.boundedWidth)
      .attr("y", referenceBandPlacement)
      .attr("height", dimensions.boundedHeight - referenceBandPlacement)
      .attr("fill", "#ffece6");
  
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.boundedWidth]);
  
    //6. Convert a datapoints into X and Y value
  
    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveBasis);
  
    const lineGenerator2 = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor2(d)))
      .curve(d3.curveBasis);
  
    const lineGenerator3 = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor3(d)))
      .curve(d3.curveBasis);

    // 7. Convert X and Y into Path
  
    const line = bounds
      .append("path")
      .attr("d", lineGenerator(dataset))
      .attr("fill", "none")
      .attr("stroke", "Blue")
      .attr("stroke-width", 2);
  
    const line2 = bounds
      .append("path")
      .attr("d", lineGenerator2(dataset))
      .attr("fill", "none")
      .attr("stroke", "Red")
      .attr("stroke-width", 2);
  
    const line3 = bounds
      .append("path")
      .attr("d", lineGenerator3(dataset))
      .attr("fill", "none")
      .attr("stroke", "Green")
      .attr("stroke-width", 2);
  
    //8. Create X axis and Y axis
    // Generate Y Axis
  
    const yAxisGenerator = d3.axisLeft().scale(yScale);
    const yAxis = bounds.append("g").call(yAxisGenerator);
  
    // Generate X Axis
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    const xAxis = bounds
      .append("g")
      .call(xAxisGenerator.tickFormat(d3.timeFormat("%b,%y")))
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);
  
    //9. Add a Chart Header
    console.log("dimensions",dimensions);
  
    wrapper
      .append("g")
      .style("transform", `translate(${50}px,${15}px)`)
      .append("text")
      .attr("class", "title")
      .attr("x", dimensions.width / 2)
      .attr("y", dimensions.margin.top / 2)
      .attr("text-anchor", "middle")
      .text("Covid dashboard NL")
      .style("font-size", "1.2em")
      .style("text-decoration", "underline");
      
    wrapper
      .append("g")
      .style("transform", `translate(${50}px,${15}px)`)
      .append("text")
      .attr("class", "title")
      .attr("x", dimensions.width / 2)
      .attr("y", 20 + dimensions.margin.top / 2)
      .attr("text-anchor", "middle")
      .text("("+dataset[0].Datum+")")
      .style("font-size", "1.2em");

    wrapper.append("circle").attr("cx",30+(dimensions.width / 4)).attr("cy",130).attr("r", 6).style("fill", "blue");
    wrapper.append("circle").attr("cx",30+(dimensions.width / 4)).attr("cy",160).attr("r", 6).style("fill", "red");
    wrapper.append("circle").attr("cx",30+(dimensions.width / 4)).attr("cy",190).attr("r", 6).style("fill", "green");
    wrapper.append("text").attr("x", 50+(dimensions.width / 4)).attr("y", 130).text("# hospital beds: "+dataset[0][selectedDataColumn]+")").style("font-size", "0.8em").attr("alignment-baseline","middle");
    wrapper.append("text").attr("x", 50+(dimensions.width / 4)).attr("y", 160).text("# ICU beds COVID: "+dataset[0][covidBeds]+")").style("font-size", "0.8em").attr("alignment-baseline","middle");
    wrapper.append("text").attr("x", 50+(dimensions.width / 4)).attr("y", 190).text("# ICU beds non-COVID: "+dataset[0][nonCovidBeds]+")").style("font-size", "0.8em").attr("alignment-baseline","middle");

    
  
  }

  drawLineChart();
  window.addEventListener("resize", drawLineChart);
