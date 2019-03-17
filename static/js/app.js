function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    panel.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });

    });
}

function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
d3.json(`/samples/${sample}`).then((data) => {

  const otu_ids = data.otu_ids
  const sample_values = data.sample_values
  const otu_labels = data.otu_labels
 

    // Build a Bubble Chart using the sample data
    var bubblelayout = {
      margin: {b: 0},
      xaxis: {title: "OTU IDS"},
        };


  var bubblechart = [{
  x: sample_values,
  y: otu_ids,
  mode: "markers",
  type: "scatter",
  text: otu_labels,
  marker: {
    color: otu_ids,
    size: sample_values,
  }
}
];
 


Plotly.plot("bubble", bubblechart, bubblelayout);



    // Build a Pie Chart
    // Use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

var pieplot = [{
  values: sample_values.slice(0,10),
  labels: otu_ids.slice(0,10),
  hovertext: otu_labels.slice(0,10),
  type: "pie"
}
];

var pielayout = {
  margin: {b:5},
  title: "Top 10 Samples"
};

Plotly.plot("pie", pieplot, pielayout);

 })
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();



