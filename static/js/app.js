// Read in samples.json from url//
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch JSON data and console log it//
d3.json(url).then(function (data) {
    console.log(data);
});

// Display the initial plot//
function init() {
    //select dropdown menu//
    let dropdownMenu = d3.select("#selDataset");
    
    // Pull names from data to populate dropdown menu//
    d3.json(url).then((data) => {

        let names = data.names;
        names.forEach((name) => {
            // Add names to dropdown menu//
            dropdownMenu
                .append("option")
                .text(name)
                .property("value", name);
        });
    
        // Set initial name in menu and build charts & demographics//
        let sampleOne = names[0];

        buildBarChart(sampleOne);
        buildBubbleChart(sampleOne);
        buildDemographics(sampleOne);
    });
};
// Initialize the dashboard//
init();

function optionChanged(newSample) {
    buildDemographics(newSample);
    buildBarChart(newSample);
    buildBubbleChart(newSample);
};

// Setup bar chart//
function buildBarChart(sample) {
    // Load and retrieve sample data//
    d3.json(url).then((data) => {
        let samples = data.samples;

        // Filter sample data to selected item//
        let value = samples.filter(result => result.id == sample);
        
        // Assign first sample in array to variable//
        let selectedValue = value[0];

        // Get the otu_ids, labels, and sample_values//
        let sample_values = selectedValue.sample_values;
        let otu_ids = selectedValue.otu_ids;
        let otu_labels = selectedValue.otu_labels;

        // Set up trace info//
        let barTrace = [{
            x: sample_values.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
  
        // Set chart layout//
        let barLayout = {
            height: 600,
            width: 800,
            title: "Top 10 OTUs Found"
        };

        // Plot the chart//
        Plotly.newPlot("bar", barTrace, barLayout);
    })
  };
  
// Setup bar chart//
function buildBubbleChart(sample) {
    // Load and retrieve sample data//
    d3.json(url).then((data) => {
        let samples = data.samples;

        // Filter sample data to selected item//
        let value = samples.filter(result => result.id == sample);
        
        // Assign first sample in array to variable//
        let selectedValue = value[0];

        // Get the otu_ids, labels, and sample_values//
        let sample_values = selectedValue.sample_values;
        let otu_ids = selectedValue.otu_ids;
        let otu_labels = selectedValue.otu_labels;

        // Set up trace info//
        let bubbleTrace = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];
  
        // Set chart layout//
        let bubbleLayout = {
            title: "Bacteria per Culture",
            xaxis: {title: "OTU ID"}
        };

        // Plot the chart//
        Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);
    })
  };

function buildDemographics(sample) {
    // Load and retrieve demographic data//
    d3.json(url).then((data) => {
        let metadata = data.metadata;

        // Filter data to match sample//
        let value = metadata.filter(result => result.id == sample);

        // Assign first datapoint in array to variable//
        let selectedValue = value[0];

        // Select the panel and clear existing metadata//
        let panel = d3.select("#sample-metadata");
        panel.html("");

        // Add each key/value pair to the panel
        Object.entries(selectedValue).forEach(([key, value]) => {
        panel.append("h5").text(`${key}: ${value}`);
        });
    });
};