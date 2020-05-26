
d3.json("samples.json").then(sample => {
    var samplesData = sample.samples
    var samplesMetadata = sample.metadata
    var idList = samplesData.map(sampleInstance => sampleInstance.id)
    var otuIds = samplesData.map(sampleInstance => sampleInstance.otu_ids)
    var otuLabels = samplesData.map(sampleInstance => sampleInstance.otu_labels)
    var sampleValues = samplesData.map(sampleInstance => sampleInstance.sample_values)
    idList.forEach(id => {
        d3.select("#selDataset")
            .append("option")
            .text(id)
    });

    function plotBar(currentId) {
        var currentSample = samplesData.find(sampleInstance => sampleInstance.id === currentId);
        xValues = currentSample.sample_values.slice(0, 10)
        top10Labels = currentSample.otu_ids.slice(0, 10)
        yValues = top10Labels.map(label => `OTU ${label}`)

        barData = [{
            x: xValues,
            y: yValues,
            type: "bar",
            orientation: "h",
            text: currentSample.otu_labels
        }];

        layout = {
            yaxis: {
                autorange: "reversed"
            }
        };

        Plotly.newPlot("bar", barData, layout);

    }

    function plotScatter(currentId) {
        var currentSample = samplesData.find(sampleInstance => sampleInstance.id === currentId);

        var scatterData = [{
            x: currentSample.otu_ids,
            y: currentSample.sample_values,
            mode: 'markers',
            type: 'scatter',
            text: currentSample.otu_labels,
            marker: {
                size: currentSample.sample_values,
                color: currentSample.otu_ids
            }
        }];

        scatterLayout = {
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot('bubble', scatterData, scatterLayout);
    }

    function fillMetadata(currentId) {
        d3.select("#sample-metadata")
            .text("")
        var currentMetadata = samplesMetadata.find(sampleInstance => sampleInstance.id == currentId);
        Object.entries(currentMetadata).forEach(([key, value]) => {
            d3.select("#sample-metadata")
                .append("p")
                .text(`${key}: ${value}`)
        });
    }

    function plotGaugeChart(currentId){
        var currentMetadata = samplesMetadata.find(sampleInstance => sampleInstance.id == currentId);
        var washFreq = currentMetadata.wfreq;
        
        var gaugeData = [
            {
              type: "indicator",
              mode: "gauge+number",
              value: washFreq,
              title: { text: "Belly Button Washing Frequency<br>Scrubs Per Week"},
              gauge: {
                axis: {
                    range: [null, 9],
                    ticks: "",
                    tickmode: "array",
                    ticktext: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9"],
                    tickvals: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5]
                },
                bar: { color: "green" },
                bgcolor: "white",
                borderwidth: 2,
                steps: [
                    { range: [0, 1], color: "rgba(255, 255, 255, 0)" },
                    { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
                    { range: [2, 3], color: "rgba(210, 206, 145, .5)" },
                    { range: [3, 4], color: "rgba(202, 209, 95, .5)" },
                    { range: [4, 5], color: "rgba(170, 202, 42, .5)" },
                    { range: [5, 6], color: "rgba(110, 154, 22, .5)" },
                    { range: [6, 7], color: "rgba(75, 145, 18, .5)" },
                    { range: [7, 8], color: "rgba(45, 138, 10, .5)" },
                    { range: [8, 9], color: "rgba(14, 127, 0, .5)"}
                
                ],
              }
            }
        ];

        var gaugeLayout = {
        width: 500,
        height: 400,
        margin: { r: 20, l: 20 },
        };
          
        Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    }

    var dropdownMenu = d3.select("#selDataset");
    plotBar(dropdownMenu.property("value"));
    plotScatter(dropdownMenu.property("value"));
    fillMetadata(dropdownMenu.property("value"));
    plotGaugeChart(dropdownMenu.property("value"));

    dropdownMenu.on("change", getData);

    function getData() {
        currentId = dropdownMenu.property("value");
        plotBar(currentId);
        plotScatter(currentId);
        fillMetadata(currentId);
        plotGaugeChart(currentId);
    }

});