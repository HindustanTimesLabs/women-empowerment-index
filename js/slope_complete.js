var slope_width = $("#slopegraph").width();
    
if (slope_width>600)
    {
        var margin = {top: 0, bottom: 0, left: 150, right: 150};
        slope_height = 450; 
    }
else{
    var margin = {top: 0, bottom: 0, left: 100, right: 100};    
    slope_height = 400; 
}

function search(data){

  var arr = [];
  data.forEach(function(d){
    arr.push(d.state);
  });

  $(".control.search")
  .css({
        "position": "relative",
        "margin-top": "10px"
  })
  .autocomplete({
    source: arr
  })
  .keyup(function(e){
    if (e.which == 13){
      search_state();
    }
  });

  $(document).on("click", ".ui-menu-item", function(){
    search_state();
  });
}


var draw_chart = function(file_number){
    data_file = "../data/slope" + file_number + ".csv"
    d3.csv(data_file, function(error, data){
        search(data)
        //Calculate domain: find max and min value in dataset
        var max_2015 = Math.max.apply(Math,data.map(function(o){return o.val_2015;}))
        var min_2015 = Math.min.apply(Math,data.map(function(o){return o.val_2015;}))

        var max_2005 = Math.max.apply(Math,data.map(function(o){return o.val_2005;}))
        var min_2005 = Math.min.apply(Math,data.map(function(o){return o.val_2005;}))

        var y = d3.scaleLinear()
                .domain([Math.min(min_2015, min_2005) - 1, Math.max(max_2005,max_2015) + 1])
                .range([slope_height, 0])

        draw(data,y);
    });
}


function draw(data,y){


    //remove existing vix
    d3.select("#slopegraph").select("svg").remove()

    d3.select("#slopegraph_year").select("svg").remove()
    var svg_year = d3.select("#slopegraph_year")
                    .append("svg")
                    .attr("width", slope_width)
                    .attr("height", 30)
                    .attr("font-size", "0.8em")
                    .attr("font-weight", "800")


    svg_year.append("text")
            .attr("x", slope_width - margin.right)
            .attr("y", 20)
            .text("Now (2015-16)")
            .attr("font-size", "0.8em")

    svg_year.append("text")
            .attr("x", margin.left)
            .attr("y", 20)
            .attr("text-anchor", "end")
            .text("Then (2005-06)")
            .attr("font-size", "0.8em")

    var svg = d3.select("#slopegraph")
                .append("svg")
                .attr("width", slope_width)
                .attr("height", slope_height)



    //Create slopelines
    svg.selectAll(".line")
        .data(data)
        .enter()
        .append("line")
        .attr("class", function(d){ return "line " + d.show + " " + slugify(d.state); })
        .attr("x1", margin.left)
        .attr("y1", function(d){ return y(d.val_2005); })
        .attr("x2", slope_width - margin.right)
        .attr("y2", function(d){ return y(d.val_2015); })
        .attr("stroke-width", 4)
        // .attr("stroke", function(d){return d.val_2015 > d.val_2005 ? "#466289" : "#FFB739"; })
        .attr("stroke", function(d){return d.val_2015 > d.val_2005 ? "#00da9d" : "#b6212d"; })
        
        .on("mouseover", mouseover)
        .on("mouseleave", mosuseout)

    //add circles at end of lines
    // svg.selectAll(".round-corner")
    //     .data(data)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", margin.left)
    //     .attr("cy", function(d){ return y(d.val_2005); })
    //     .attr("r", 4)
    //     //.attr("stroke-width", 3)
    //     //.attr("fill", "black")
    //     .attr("fill", function(d){return d.val_2015 > d.val_2005 ? "#00da9d" : "#b6212d"; })

// <svg height="100" width="100">
//   <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
// </svg>
    
    //Add label on right side
    svg.selectAll(".year2_label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d){ return "label year2_label " + d.show + " " + slugify(d.state); })
        .attr("x", slope_width - margin.right)
        .attr("dy", 5)
        .attr("y", function(d) { return y(d.val_2015); })
        .attr("text-anchor", "start")
        .text(function(d){ return d.display_name + "," + d.val_2015 + "%"; })
        .on("mousemove", mouseover)
        .on("mouseleave", mosuseout)

    //Add labels on left side
    svg.selectAll(".year1_label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", function(d){ return "label year1_label " + d.show + " " + slugify(d.state); })
        .attr("x", margin.left)
        .attr("dy", 5)
        .attr("y", function(d) { return y(d.val_2005); })
        .attr("text-anchor", "end")
        .text(function(d){ return d.display_name + "," + d.val_2005 + "%"; })
        .on("mousemove", mouseover)
        .on("mouseleave", mosuseout)

    //Mouseout
    function mosuseout(d){
        
        d3.select(".line." + slugify(d.state))
            //.attr("stroke-width", "3")
            .classed("highlight", false)
            //.attr("stroke", function(d){ return d.val_2015 > d.val_2005 ? "#466289" : "#FFB739"; })

        d3.select(".label." + slugify(d.state))
             // .attr("text-anchor", "start")
             // .text(function(d){return ""})
             .attr("font-weight", "normal");

        d3.selectAll(".label." + slugify(d.state))
            .classed("highlight-text", false)

        // $(".tip-slope").hide();
        initial_slope_state()
    };


    $("#slopegraph").append("<div class='tip-slope'></div>");
    $(".tip-slope").hide();

    //Mousover
    function mouseover(d){

        d3.selectAll(".line").attr("stroke-opacity","0.3")
        d3.selectAll(".label").attr("fill-opacity","0.3")

        d3.select(".line." + slugify(d.state))
            .classed("highlight", true)
            // .attr("stroke-width", "3")

        d3.selectAll(".label." + slugify(d.state))
            .classed("highlight-text", true)


        // d3.select(".label." + slugify(d.state))
        //     .attr("text-anchor", "start")
        //     .text(function(d){return d.state + "," + d.val_2015})
        //     .attr("font-weight", 600);

        // populate tip
        // $(".tip-slope").show();
        // $(".tip-slope").empty();
        // $(".tip-slope").append("<div class='name'>" + d.state + "</div>")

        // $(".tip-slope").append("<div class='indicator'>" + d.name + "</div>")

        // $(".tip-slope").append("<table></table>");

        // $(".tip-slope table").append("<tr class='year'></tr>");
        // $(".tip-slope table .year").append("<td><strong>2005-06</strong></td>");
        // $(".tip-slope table .year").append("<td><strong>2015-16</strong></td>");

        // $(".tip-slope table").append("<tr class='value'></tr>");
        // $(".tip-slope table .value").append("<td>" + d.val_2005 + "%</td>");
        // $(".tip-slope table .value").append("<td>" + d.val_2015 + "%</td>");

        
        //$(".tip-slope").append("2005-06:" + d.val_2005)

        // get current mouse coordinates
        // var coordinates = [0,0];
        // coordinates = d3.mouse(this);
        // var x = coordinates[0];
        // var y = coordinates[1];

        // var slopegraph_top = $("#slopegraph").offset().top;
        // var slopegraph_left = $("#slopegraph").offset().left;

        // var cursor_padding = 20

        // var tip_padding = Number($(".tip-slope").css("padding-top").replace("px",""))

        // $(".tip-slope").css({
        //     left: x + slopegraph_left - $(".tip-slope").width() - cursor_padding,
        //     top: y + slopegraph_top - $(".tip-slope").height() - (tip_padding * 2) - cursor_padding
        // });


    };

}

function search_state(){
    state_name = $(".control.search").val()

    initial_slope_state()
    d3.selectAll(".line").attr("stroke-opacity","0.3")
    d3.selectAll(".label").attr("fill-opacity","0.3")

    //$(".line." + slugify(state_name)).show()

    d3.select(".line." + slugify(state_name))
        .classed("highlight", true)
        .attr("display", "block")

    d3.select(".year1_label." + slugify(state_name))
        .classed("highlight-text", true)
        .attr("display", "block")


    d3.select(".year2_label." + slugify(state_name))
        .classed("highlight-text", true)
        .attr("display", "block")

       //.attr("class", function(){return "line " + slugify(state_name) + " " +  + " highlight"})

    //d3.select(".year1_label." + slugify(state_name)).classed("show", false)
    //$(".year1_label." + slugify(state_name)).show()
}

function initial_slope_state(){
    d3.selectAll(".line").attr("stroke-opacity","1")
    
    d3.selectAll(".line")
    .classed("highlight", false)

    d3.selectAll(".label")
    .classed("highlight-text", false)

    $(".highlight").attr("display", "None")

    $(".highlight-text").attr("display", "None")

    d3.selectAll(".label").attr("fill-opacity","1")
}


function drawSlopeLegend(data, scale, color){
  $("#legend_slope").empty()
  //$("#legend_slope").append("<div><em><font style='font-size: 0.8em;'><b>Color</b> indicates rank, darker is worse</font></em></div>")
  

  $("#legend_slope").append("<div class='legend-item legend-slope-item-" + "1" + "'></div>");
  $(".legend-slope-item-" + "1").append("<div class='swatch' style='background:" + "#00da9d" + "'></div><div class='name'>" + "Value increased" + "</div>");  

  $("#legend_slope").append("<div class='legend-item legend-slope-item-" + "2" + "'></div>");
  $(".legend-slope-item-" + "2").append("<div class='swatch' style='background:" + "#b6212d" + "'></div><div class='name'>" + "Value decreased" + "</div>");  

  $("#legend_slope").append("<div class='legend-item legend-slope-item-" + "3" + "'></div>");
  $(".legend-slope-item-" + "3").append("<div class='swatch' style='background:" + "#FFB739" + "'></div><div class='name'>" + "Selected/Highlight State" + "</div>");  

}

drawSlopeLegend()

function show_all(){
    d3.selectAll(".line")
    .classed("showAll", true)

    //$(".line").attr("showAll", true)
}

function reset_all(){
    //$(".line.no").hide()//attr("display", "none")

    //$(".line .no .highlight")
    //.hide()
    //.classed("highlight", false)

    d3.selectAll(".line")
    .classed("showAll", false)

    initial_slope_state()
}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

//On load, draw slopegraph for indictor 1
draw_chart("101");