function buildMetadata(sample) {
  var defaultURL = `metadata/${sample}`;
  d3.json(defaultURL).then(function(data){
    var PANEL = d3.select("#sample-metadata");
    PANEL.HTML = ("");
    Object.entries(data).forEach(function([key, value]){
      PANEL.append('span').text(`${key}: ${value}`);
      PANEL.append('br');
    });
  })
}

function buildCharts(sample) {
  var sample_url = `samples/${sample}`;

  d3.json(sample_url).then(function(data){

// TOP Ten Values --> 
// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

      var topTenOtuIds = data.otu_ids.slice(0,10);
      var topTenOtuLabels = data.otu_labels.slice(0,10);
      var topTenSampleValues = data.sample_values.slice(0,10);

// Create the Bubble Chart
      var BubbleChartTraceData =  [{
        x: data.otu_ids,
        y: data.sample_values,
        mode: 'markers',
        text: data.otu_labels,
        marker: {
          color: data.otu_ids,
          size: data.sample_values
        }
      }];

      var BubbleChartLayout = {
      hovermode:'closest',
      title:'Bubble Chart',
      xaxis:{zeroline:false, title: 'OTU ID'},
      yaxis:{zeroline:false, title: 'Sample Values'}
      };

// Create the Pie Chart
      var PieChartTraceData = [{
        "labels": topTenOtuIds,
        "values": topTenSampleValues,
        "hovertext": topTenOtuLabels,
        "type": "pie"
      }];
      Plotly.newPlot('pie', PieChartTraceData);
      Plotly.newPlot('bubble',BubbleChartTraceData, BubbleChartLayout);
  })
}

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
