
// See the heatmap controller for the url format
let apiPlotUrl = "http://localhost:8080/experiment/exp1/plots/heatmap";
let svgHeight = 750;
let svgWidth = 1000;
let clusters = null;
let resolution = null;


function fetchResolutions(){
}

// execute when the api url is available
function fetchData(resolution) {
  console.log("Fetching data");
  // TODO add resolution to the url
  return fetch(apiPlotUrl + "?res=" + resolution)
  .then((response)=> {
    return response.json();
  })
  .then((data)=> {
    clusters = data.sort(
        (c1, c2) => (c1.name < c2.name) ? -1 : (c1.name > c2.name) ? 1 : 0);
    draw();
  })
}

// execute when 'clusters' or 'selection' changes
function draw(){
  console.log("Drawing");
  // select svg element TODO
  let selection = d3.select("svg");
  try {
    let markersFullList = [];
    clusters.map(function(c){
        let markerCodes = [];
        c.markers.map(function(m){
            markerCodes = [...markerCodes, m]
        })
        markersFullList = [...markersFullList, ...markerCodes]
    })
    //console.log("Markers full list: " + markersFullList)
    let markerScale = new Map(markersFullList.map((m, index) => [m, index]))
    //console.log(markerScale)
    clusters.map(function(c){
        c.bucketScale = new Map(c.buckets.map((b, index)=>[b, index]))
    })
    //console.log(clusters.map(c=>c.bucketScale))
    let markerLabelWidth = 140;
    let clusterLabelHeight = 30;
    let vSeparator = 3;
    let hSeparator = vSeparator;
    
    let numberOfBuckets = 0;
    clusters.map(function(c) {
        numberOfBuckets = numberOfBuckets + c.buckets.length;
    });
    //console.log("Number of buckets: " + numberOfBuckets)
    let blockWidth = (svgWidth - markerLabelWidth - clusters.length * hSeparator)/numberOfBuckets;
    let blockHeight = (svgHeight - clusterLabelHeight - clusters.length * vSeparator)/markersFullList.length;
    let colorScale = d3.scaleLinear()
        .domain([0, 4])
        .range(['#fff', '#006060'])

    let clusterColorMap = new Map()
    clusterColorMap.set("0", "red")
    clusterColorMap.set("1", "orange")
    clusterColorMap.set("2", "yellow")
    clusterColorMap.set("3", "magenta")
    clusterColorMap.set("4", "cyan")
    clusterColorMap.set("5", "purple")
    clusterColorMap.set("6", "blue")
    clusterColorMap.set("7", "pink")
    clusterColorMap.set("8", "grey")
    clusterColorMap.set("9", "red")
    clusterColorMap.set("10", "green")

    let separatorColor = "black";

    // Generate heatmap
    clusters.map(function(c, i) {
        console.log("Generating cluster: " + c.name + " (" + i + ")")
        let data = c.expressions;
        // expression blocks
        selection.selectAll()
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => markerLabelWidth + (i+1) * hSeparator + i * c.buckets.length * blockWidth + c.bucketScale.get(d.bucketId) * blockWidth)
            .attr('y', (d) => markerScale.get(d.code) * blockHeight + vSeparator *Math.floor(markerScale.get(d.code)/c.markers.length))
            .attr('width', (d) => blockWidth)
            .attr('height', (d) => blockHeight)
            .attr('fill', (d) => colorScale(d.expression))

        // cluster label blocks
        selection.append('rect')
            .attr('x', markerLabelWidth + (i+1) * hSeparator + i * c.buckets.length * blockWidth)
            .attr('y', svgHeight - clusterLabelHeight)
            .attr('width', c.buckets.length * blockWidth)
            .attr('height', clusterLabelHeight)
            //.attr('fill', clusterColorScale(i))
            .attr('fill', clusterColorMap.get(c.name))

        // cluster label texts
        selection.append('text')
            .text(c.name)
            .attr('x', markerLabelWidth + (i+1) * hSeparator + (i+0.2) * c.buckets.length * blockWidth)
            .attr('y', svgHeight - 0.2 * clusterLabelHeight)
            .attr('fill', 'black')


        // marker label blocks
        selection.selectAll()
            .data(c.markers)
            .enter()
            .append('rect')
            .attr('x', 0)
            .attr('y', (d) => markerScale.get(d) * blockHeight + vSeparator *Math.floor(markerScale.get(d)/c.markers.length))
            .attr('width', markerLabelWidth)
            .attr('height', blockHeight)
            //.attr('fill', clusterColorScale(i))
            .attr('fill', clusterColorMap.get(c.name))

        // marker label texts
        selection.selectAll()
            .data(c.markers)
            .enter()
            .append('text')
            .text(function(d) {return d})
            .attr('x', 0)
            .attr('y', (d) => blockHeight -3 + markerScale.get(d) * blockHeight + vSeparator *Math.floor(markerScale.get(d)/c.markers.length))
            .attr('font-size', (d) => blockHeight )
            .attr('fill', 'black')

        // Horizontal separators
        console.log("buckets length: " + c.buckets.length)
        selection.append('rect')
            .attr("x", markerLabelWidth + i * (c.buckets.length * blockWidth + hSeparator))
            .attr("y", 0)
            .attr("width", hSeparator)
            .attr("height", svgHeight )
            .attr("fill", separatorColor)

        // Vertical separators
        selection.append('rect')
            .attr("x", 0)
            .attr("y", (i+1) * blockHeight * c.markers.length + i * vSeparator)
            .attr("width", svgWidth)
            .attr("height", vSeparator)
            .attr("fill", separatorColor)

})
  } catch (error) {
      console.log("Error caught: " + error)
  }
}

class Heatmap extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div className="container py-3">
        <svg width=${svgWidth} height=${svgHeight}>

        </svg>
      </div>
    `;
    fetchData("cluster_0.10");
  }
}

customElements.define('heatmap-component', Heatmap);
