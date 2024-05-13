let experiment = null;
let apiPlotUrl = "http://localhost:8080/experiment/exp1/plots/lowDimensional/";
let query_by_resolution = "byResolution?resolution=cluster_0.10";

function fetchData(query){
  fetch(apiPlotUrl + query)
      .then((response) => {
          return response.json();
      })
      .then((data) =>{
          experiment = data;
          draw();
      });
 }

function draw(){
    try{
    if(experiment){
        const colorMap = new Map([
            ["0", "red"],
            ["1", "blue"],
            ["2", "green"],
            ["3", "yellow"],
            ["4", "pink"],
            ["5", "brown"],
        ]);
        const colorArray = experiment.clusters.map(function(n){
            return colorMap.get(n);
        }) 
        let data=[
                {
                    x: experiment.tsne1,
                    y: experiment.tsne2,
                    text: experiment.clusters,
                    type: "scatter",
                    mode: "markers",
                    marker: {
                        color: colorArray,
                    }
                },
                ]
        let layout={width: 500, height: 500, title: "Low dimensional plot"}
        Plotly.newPlot("low_dimensional", data, layout);
                
    }
    } catch (error){
        console.log(error);
    }
   }
fetchData(query_by_resolution);
