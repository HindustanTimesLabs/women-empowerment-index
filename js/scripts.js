var window_height = $(window).height()
var window_width = $("#map").width()

if (window_width<600)
{
  //$("#map").width(window_width)
  $("#map").height(window_width + 80)

  var width = $("#map").width(), height = $("#map").height();  
}
else{
 var width = $("#map").width(), height = $("#map").height();   
}

console.log(height)

var projection = d3.geoMercator();

var path = d3.geoPath()
    .projection(projection)
    .pointRadius(2);

    var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);



var g = svg.append("g");

var color = chroma.scale("OrRd");

d3.queue()
    .defer(d3.json, "data/geodata.json")
    .defer(d3.csv, "data/100.csv")
    .await(ready);

function ready(error, geo, data){
  var boundary = centerZoom(geo);
  drawSubUnits(geo);
  drawOuterBoundary(geo, boundary);

  var f = data.map(function(d){
    d.rank = +d.rank;
    return d;
  });

  var arr =[];
  data.forEach(function(d){
    arr.push(d.rank);
  });
  arr.sort();
  var x = [d3.quantile(arr, 0),d3.quantile(arr, .25),d3.quantile(arr, .5),d3.quantile(arr, .75),d3.quantile(arr, 1)];
  var x = [1,10,19,28,36]
  
  color.classes(x);

  colorSubUnits(f, color);
  drawLegend(f, x, color);
  drawTip(f, color);

}

function change(data_file){

  var x = [1,9,18,27,36]
  
  color.classes(x);

  d3.csv(data_file, function(error, data){

    $(".tip").remove();

    f = data.map(function(d){ d.rank = +d.rank; return d; });
    console.log(f)
    colorSubUnits(f, color);
    drawLegend(f, x, color);
    drawTip(f, color);  
  })

}


// This function "centers" and "zooms" a map by setting its projection's scale and translate according to its outer boundary
// It also returns the boundary itself in case you want to draw it to the map

function centerZoom(data){

  var o = topojson.mesh(data, data.objects.polygons, function(a, b) { return a === b; });

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  return o;
}

function drawOuterBoundary(data, boundary){
  g.append("path")
      .datum(boundary)
      .attr("d", path)
      .attr("class", "subunit-boundary");
}

function drawSubUnits(data){
  g.selectAll(".subunit")
      .data(topojson.feature(data, data.objects.polygons).features)
    .enter().append("path")
      .attr("class", function(d){ return "subunit state-" + strings.toSlugCase(d.properties.name); })
      .attr("d", path);
}

function colorSubUnits(data, color){

  g.selectAll(".subunit")
      .style("fill", getFill);

  function getFill(d){
    var w = _.where(data, {state: d.properties.name});
    if (w.length > 0) return color(w[0].rank)
  }

}

function drawLegend(data, scale, color){
  $("#legend").empty()
  $("#legend").append("<div><em><font style='font-size: 0.8em;'><b>Color</b> indicates rank, darker is worse</font></em></div>")
  var legend_data = ['Rank 1-9', '10-18', '19-27', '28-36']
  scale.forEach(function(d, i){
    if (i <scale.length-1) {
      console.log(i)

      $("#legend").append("<div class='legend-item legend-item-" + i + "'></div>");
      $(".legend-item-" + i).append("<div class='swatch' style='background:" + color(d) + "'></div><div class='name'>" + legend_data[i] + "</div>");
    }
  });


}

function update_tip(new_data, color){

}

function drawTip(data, color){

  $("body").append("<div class='tip'></div>");
  $(".tip").hide();

  g.selectAll(".subunit")
    .on("mouseover", tipShow)
    .on("mouseout", tipHide);

  $(".subunit").mousemove(tipMove); // do this with jQuery because the d3 version gets messed up when you zoom

  function tipShow(d){

    d3.select(this).moveToFront();

    var state = d.properties.name;
    var slug = strings.toSlugCase(state);
    $(".tip").show();
    $(".subunit").removeClass("highlight");
    $(".state-" + slug).addClass("highlight");
    var w = _.where(data, {state: state.toString()})[0];

    var c = color(w.rank);
    var d = color(w.check);


    $(".tip").append("<div class='name'>" + w.state + "</div>");

    //w.legend_name.toString()

    $(".tip").append("<table></table>");

    if (w.indicator=="100"){

        $(".tip table").append("<tr class='rank'></tr>");
        $(".tip table .rank").append("<td>Overall Rank</td>");
        $(".tip table .rank").append("<td><div class='swatch' style='background:" + c + "'></div><div class='value'>" + w.rank.toString() + "</div></td>");

        
        $(".tip table").append("<tr class='check'></tr>");
        $(".tip table .check").append("<td>" + w.legend_name.toString() +"</td>");
        $(".tip table .check").append("<td><div class='value'>" + w.total.toString() + "</div></td>");
    
    } 
    else
    {

        // $(".tip table").append("<tr class='indic_name'></tr>");
        // $(".tip table .indic_name").append("<td>" + w.legend_name.toString() + "</td>")

        $(".tip table").append("<tr class='rank'></tr>");
        $(".tip table .rank").append("<td>Indicator Rank</td>");
        $(".tip table .rank").append("<td><div class='swatch' style='background:" + c + "'></div><div class='value'>" + w.rank.toString() + "</div></td>");

   
        

        $(".tip table").append("<tr class='total'></tr>");
        $(".tip table .total").append("<td>Total</td>");
        $(".tip table .total").append("<td><div class='value'>" + w.total.toString() + " %</div></td>");

        $(".tip table").append("<tr class='rural'></tr>");
        $(".tip table .rural").append("<td>Rural</td>");
        $(".tip table .rural").append("<td><div class='value'>" + w.rural.toString() + " %</div></td>");

        $(".tip table").append("<tr class='urban'></tr>");
        $(".tip table .urban").append("<td>Urban</td>");
        $(".tip table .urban").append("<td><div class='value'>" + w.urban.toString() + " %</div></td>");
    }


  };

  function tipMove(e){

    // calculate top
    var y = e.pageY;
    var h = $(".tip").height();
    var o = $("#map").offset().top;
    var t = y - h - 20;

    // calculate left
    var x = e.pageX;
    var w = $(".tip").width();
    var m = $("#map").width() + $("#map").offset().left;
    var l = x - w / 2;

    $(".tip").css({
      top: t < o ? y + 10 : t,
      left: l < 10 ? 10 : l + w + 10 > m ? m - w - 10 : l
    });

  }

  function tipHide(d){

    d3.selectAll(".subunit").moveToBack();
    $(".subunit").removeClass("highlight");
    $(".tip").empty().hide();

  }
}

var centered,
  z = 1;

// UTILITY FUNCTIONS:
// Can be used in multiple function scalled from ready()

function getBoundingBoxCenter(selection) {
    // get the DOM element from a D3 selection
    // you could also use "this" inside .each()
    var element = selection.node(),
    // use the native SVG interface to get the bounding box
    bbox = element.getBBox();
    // return the center of the bounding box
    return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}

// function to execute when a constituency is clicked (which zooms it in and out)
function clicked(d){

  var x, y;
  var boundary = d3.select('.subunit-boundary');
  var center = getBoundingBoxCenter(boundary);

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    z = 3;
    centered = d;
    $('.zoom.out').removeClass('inactive');
  } else {
    x = center[0];
    y = center[1];
    z = 1;
    centered = null;
    $('.zoom.out').addClass('inactive');
  }

  g.selectAll("path")
     .classed("active", centered && function(d) { return d === centered; });

  g.transition()
     .duration(750)
     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + z + ")translate(" + -x + "," + -y + ")")
     .style("stroke-width", 1 / z + "px");

  $(".control.zoom").addClass(z == 1 ? "inactive" : "active").removeClass(z == 1 ? "active" : "inactive");
  if (z != 1){
    d3.select(".control.zoom")
        .on("click", clicked);
  }

}
