let apiPlotUrl = "http://localhost:8080/experiment/exp1/plots/violin";
let violinGroups = null;
let query_by_resolution = "/byResolution?res=cluster_0.20&genes=Vcpip1&genes=1110002L01Rik"
function fetchData(query){
        fetch(apiPlotUrl + query)
        .then((response)=>{
            if (response.ok){
                return response.json();
            } else {
                throw Error("Error in response for violin plot");
            }
        })
        .then((data)=>{
            violinGroups = data;
            console.log(violinGroups);
            draw();
        })
        .catch((e)=> (console.log(e)));
}
// TODO change this function to group the data by clusters or/and samples 
function draw(){
  if (violinGroups){
      const clusterMap = new Map(violinGroups.map((vg)=>([vg.cluster, []])));
      const sampleMap = new Map(violinGroups.map((vg)=>([vg.sample, []])));
      violinGroups.map(function(vg){
          clusterMap.set(vg.cluster, [...clusterMap.get(vg.cluster), vg])
      });
      violinGroups.map(function(vg){
          sampleMap.set(vg.sample, [...sampleMap.get(vg.sample), vg])
      });

      var plotData = [];
      clusterMap.forEach(function(v, k){
          let y = [];
          let x = [];
          v.map(function(vg){
            vg.expressions.map((e)=> {
              y = [...y, e];
              x = [...x, vg.code];
            });
          })
          plotData = [...plotData, {
              type: 'violin',
              x: x,
              y: y,
              legendgroup: k,
              scalegroup: k,
              name: k,
              points: 'none',
              line: {
                  color: 'black'
              },
              fillcolor: 'blue',
              opacity: 0.6,
          }]

      })
    let layout = {
                title: "",
                yaxis: {
                    zeroline: false
                },
                violinmode: 'group'
            }
    Plotly.newPlot("violin", plotData, layout);
        }
    }
fetchData(query_by_resolution);
