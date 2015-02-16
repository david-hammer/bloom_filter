var settings = {
  width: window.innerWidth,
  height: window.innerHeight,
  cellWidth: 20,
  cellHeight: 20,
  m: 300,
  k: 11,
  n: 0,
  off: "black",
  on: "#4400FF",
  add: "#D7D3FF",
  miss: "red",
  hit: "#D7D3FF"
}
  var bloom = new BloomFilter( settings.m, settings.k );
  var contents = [];
  var body = d3.select(".container");
initialize();
document.getElementById("regenerate").onclick=initialize;
document.getElementById("add").onclick=add;
document.getElementById("contains").onclick=contains;

function initialize() {
  var m = document.getElementById("m").value;
  var k = document.getElementById("k").value;

  m = (Boolean(Number(m))) ? Number(m) : settings.m;
  k = (Boolean(Number(k))) ? Number(k) : settings.k;
  
 contents = [];
  bloom = new BloomFilter(m,k);

  var newVis = body.selectAll(".cell")
  .data(bloom._storage)
  .style("background-color",function(d){return (d) ? settings.on : settings.off;});

  newVis.enter()
  .append("div")
  .classed("cell",true)

  newVis.exit().remove();
}

function add (){
  var value = document.getElementById("item").value;
  if (value==="")
    return;

  settings.n++;
  var signature = bloom.mapItem(value);
  contents.push(value);
  bloom.add(value);

  body.selectAll(".cell")
  .data(bloom._storage)
  .transition().duration(100)
  .style("background-color", function(d,i){
    return (signature[i]) ? settings.add : (d) ? settings.on : settings.off;})
  .transition().duration(1000)
  .style("background-color",function(d,i){return (d) ? settings.on : settings.off;})
}

function contains () {
  var value = document.getElementById("item").value;
  if (value==="")
    return;

  var signature = bloom.mapItem(value);
  var isInFilter = contents.indexOf(value) > -1;
  var isPositive = bloom.contains(value);

  var isFalsePositive = !isInFilter && isPositive;

  body.selectAll(".cell")
  .data(bloom._storage)

  .transition().duration(100)
  .style("background-color", function(d,i){
    if (signature[i] && d)
      return settings.hit;
    if (signature[i])
      return settings.miss;
    if (d)
      return settings.on;
    return settings.off;
  })
  .transition().duration(1000)
  .style("background-color",function(d,i){return (d) ? settings.on : settings.off;})

  .transition().duration(100)
  .style("background-color",function(d){
    if (isFalsePositive)
      return settings.miss;
    return (d) ? settings.on : settings.off;
  })
  .transition().duration(1000)
  .style("background-color",function(d,i){return (d) ? settings.on : settings.off;});
}