data = null;
  d3.csv("https://gist.githubusercontent.com/Jannyska/2826bfeaa82511912377/raw/7e9f4ef9b6196d7c0a8b63b43fcf9a8859acbca9/gistfile1.csv", function(csv) {
    data = csv;
    // console.log("CSV", csv);

    var
        // Extract years from the dataset
        years = d3.keys(csv[0]).filter( function(d) { return d.match(/^\d/) }), // Return numerical keys
        // Extract names of countries from the dataset
        countries = csv.map( function(d) { return d["Country"] }),
        // Set "from" and "to" years to display
        from = "mentions",
        to = "refugees",
        // Extract country names and start/end values from the dataset
        data = csv
                      .map( function(d) {
                        var r = {
                          label: d["Country"],
                          start: parseInt(d[from]),
                          end: parseInt(d[to])
                        };
                        // console.log(r);
                        return r;
                      })
                      //Require countries to have both values present
                      .filter(function(d) { return (!isNaN(d.start) && !isNaN(d.end)); }),
        // Extract the values for every country for both years in the dataset for the scale
        values = data
                      .map( function(d) { return d3.round(d.start, 1); })
                      .filter( function(d) { return d; } )
                      .concat(
                        data
                          .map( function(d) { return d3.round(d.end, 1); } )
                          .filter( function(d) { return d; } )
                      )
                      .sort(d3.descending),
        // Return true for countries without start/end values
        missing = function(d) { return !d.start || !d.end; },

        // Format values for labels
        label_format = function(value) { return value; },

        font_size = 12,
        margin = 10,
        width = 800,
      height = countries.length * font_size*1.5 + margin,
          // height = 1000,

        chart = d3.select("#chart").append("svg")
                   .attr("width", width)
                   .attr("height", height*5);

    // Scales and positioning
    var slope = d3.scale.ordinal()
                  .domain(values)
                  .rangePoints([margin, height]);

  //Go through the list of countries in order, adding additional space as necessary.
  var min_h_spacing = 1.2 * font_size, // 1.2 is standard font height:line space ratio
    previousY = 0,
    thisY,
    additionalSpacing;
  //Preset the Y positions (necessary only for the lower side)
  //These are used as suggested positions.
  data.forEach(function(d) {
    d.startY = slope(d3.round(d.start,1));
    d.endY = slope(d3.round(d.end,1));
  });
  //Loop over the higher side (right) values, adding space to both sides if there's a collision
  data
    .sort(function(a,b) {
      if (a.end == b.end) return 0;
      return (a.end < b.end) ? -1 : +1;
    })
    .forEach(function(d) {
      thisY = d.endY; //position "suggestion"
      additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
  
      //Adjust all Y positions lower than this end's original Y position by the delta offset to preserve slopes:
      data.forEach(function(dd) {
        if (dd.startY >= d.endY) dd.startY += additionalSpacing;
        if (dd.endY >= d.endY) dd.endY += additionalSpacing;
      });
    
      previousY = thisY;
    });

  //Loop over the lower side (left) values, adding space to both sides if there's a collision
  previousY = 0;
  data
    .sort(function(a,b) {
      if (a.startY == b.startY) return 0;
      return (a.startY < b.startY) ? -1 : +1;
    })
    .forEach(function(d) {
      thisY = d.startY; //position "suggestion"
      additionalSpacing = d3.max([0, d3.min([(min_h_spacing - (thisY - previousY)), min_h_spacing])]);
  
      //Adjust all Y positions lower than this start's original Y position by the delta offset to preserve slopes:
      data.forEach(function(dd) {
        if (dd.endY >= d.startY) dd.endY += additionalSpacing;
        if (dd.label != d.label && dd.startY >= d.startY) dd.startY += additionalSpacing;
      });
      previousY = thisY;
    });

    // Countries
    var country = chart.selectAll("g.country")
                    .data( data )
                    .enter()
                    .append("g")
                    .attr("class", "country")
                    .classed("missing", function(d) { return missing(d); });

    country
      .on("mouseover", function(d,i) { return d3.select(this).classed("over", true); })
      .on("mouseout", function(d,i) { return d3.select(this).classed("over", false); });

    // ** Left column
    country
      .append("text")
      .classed("label start", true)
      .attr("x", 200)
      .attr("y", function(d) {return d.startY;})
      //.attr("y", function(d,i) { var rounded = d3.round(d.start, 1); return slope(rounded) })
      .attr("xml:space", "preserve")
      .style("font-size", font_size)
      .text(function(d) { return d.label+ " " + label_format(d.start); });

    // ** Right column
    country
      .append("text")
      .classed("label end", true)
      .attr("x", width-200)
      .attr("y", function(d) {return d.endY;})
      //.attr("y", function(d,i) { var rounded = d3.round(d.end, 1); return slope(rounded) })
      .attr("xml:space", "preserve")
      .style("font-size", font_size)
      .text(function(d) { return label_format(d.end) + " " + d.label; });

    // ** Slope lines
    country
      .append("line")
      .classed("slope", function(d) { return d.start || d.end; })
      .attr("x1", 210)
      .attr("x2", width-210)
      .attr("y1", function(d,i) {
        return d.start && d.end ? d.startY - font_size/2 + 2 : null;
      })
      .attr("y2", function(d,i) {
        return d.end && d.end ? d.endY - font_size/2 + 2 : null;
      });

    return chart;
  });