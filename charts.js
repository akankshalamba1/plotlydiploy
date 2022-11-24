function init() {
  var selector = d3.select("#selDataset");

  d3.json("sample_new.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);

})}

init();

function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("sample_new.json").then((data) => {
    var metadata = data.metadata;
    
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
   
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("sample_new.json").then((data) => {
    
    // 3. Create a variable that holds the samples array. 
    var sample_array = data.samples;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    
    var resultArray = sample_array.filter(sampleObj => sampleObj.id == sample);
    
    // 5. Create a variable that holds the first sample in the samples array.   
    var result = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = result.otu_ids;
    var otuLabel = result.otu_labels;
    var sampleValue = result.sample_values;
    console.log(otuId);
    // Create the yticks for the bar chart.
    
    // 7. Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuId.slice(0,10).map(OTU => "OTU " + OTU ).reverse();
   
    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValue.slice(0,10).reverse(),
      y: yticks,
      hoverinfo: otuLabel,
      type: "bar",
      orientation: "h",
      text: otuLabel.slice(0,10).reverse() 
    };
  
    var barData =[trace];
    // 9. Create the layout for the bar chart. 
    
    var barLayout = {
      title: "Top 10 Belly Button Bacteria",
    };
  
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

 // ----------------------- BUBBLE CHART ----------------------------------------------------------------

  // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuId,
      y: sampleValue,
      type: "bubble",
      text: otuLabel,
      hoverinfo: "x+y+text",
      mode: "markers",
      marker: {size: sampleValue, color: otuId, colorscale: "Earth"}
    };
    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: {
        text: "<b>Bacteria Cultures Per Sample</b>",
        y:0.95,
      },
      xaxis: {title: "OTU ID"},
      margin: {
        l: 75,
        r: 50,
        b: 60,
        t: 60,
        pad: 10
      },
      hovermode: "closest"
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);

    //----------------------- GAUGE CHART ------------------------------------------------------------
    
    // Create a variable that holds the metadata array.
    var metadata = data.metadata;
    // Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // Create a variable that holds the first sample in the metadata array.
    var Result = resultArray[0];
    // Create a variable that holds the washing frequency.
    var wFreq = parseFloat(Result.wfreq);
    // Create the trace for the gauge chart.
    var gaugeData = {
      type: "indicator",
      value: wFreq,
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,10], dtick: 2},
        bar: {color: "black"},
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "yellowgreen"},
          {range: [8,10], color: "green"}
        ],
      }
    };   
    // Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        y: 0.75,
      },
      margin: {
        l: 50,
        r: 50,
        b: 0,
        t: 50,
        pad: 50
      },
    };
    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
   });
  }