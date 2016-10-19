HTMLWidgets.widget({

    name: "sankeyNetwork",

    type: "output",

    initialize: function(el, width, height) {

        d3.select(el).append("svg")
            .style("width", "100%")
            .style("height", "100%");

        return {
          sankey: d3.sankey(),
          x: null
        };
    },

    resize: function(el, width, height, instance) {
        /*  handle resizing now through the viewBox
        d3.select(el).select("svg")
            .attr("width", width)
            .attr("height", height + height * 0.05);

        this.renderValue(el, instance.x, instance);
        */
        
        // with flexdashboard and slides
        //   sankey might be hidden so height and width 0
        //   in this instance re-render on resize
        if( d3.min(instance.sankey.size()) <= 0 ) {
          this.renderValue(el, instance.x, instance);
        }
    },

    renderValue: function(el, x, instance) {

        // save the x in our instance (for calling back from resize)
        instance.x = x;

        // alias sankey and options
        var sankey = instance.sankey;
        var options = x.options;

        // convert links and nodes data frames to d3 friendly format
        var links = HTMLWidgets.dataframeToD3(x.links);
        var nodes = HTMLWidgets.dataframeToD3(x.nodes);

        // margin handling
        //   set our default margin to be 20
        //   will override with x.options.margin if provided
        var margin = {top: 20, right: 20, bottom: 20, left: 20};
        //   go through each key of x.options.margin
        //   use this value if provided from the R side
        Object.keys(x.options.margin).map(function(ky){
          if(x.options.margin[ky] !== null) {
            margin[ky] = x.options.margin[ky];
          }
          // set the margin on the svg with css style
          // commenting this out since not correct
          // s.style(["margin",ky].join("-"), margin[ky]);
        });

        // get the width and height
        var width = el.getBoundingClientRect().width - margin.right - margin.left;
        var height = el.getBoundingClientRect().height - margin.top - margin.bottom;

        // set this up even if zoom = F
        var zoom = d3.zoom();    

        var color = eval(options.colourScale);
        
        var color_node = function color_node(d){
          if (d.group){
            return color(d.group);
          } else {
            return "#cccccc";
          }
        }

        var color_link = function color_link(d) {
          if (d.group){
            return color(d.group);
          } else {
            return  "#000000";
          }
        }

        var opacity_link_plus = 0.45;
        var opacity_link = function opacity_link(d) {
          if (d.group){
            return 0.5;
          } else {
            return 0.2;
          }
        }

        format = function(d) { return d3.format(options.numberFormat)(d); }

        // create d3 sankey layout
        sankey
            .nodes(d3.values(nodes))
            .align(options.align)
            .links(links)
            .size([width, height])
            .linkType(options.linkType)
            .nodeWidth(options.nodeWidth)
            .nodePadding(options.nodePadding)
            .scaleNodeBreadthsByString(options.scaleNodeBreadthsByString)
            .curvature(options.curvature)
            .orderByPath(options.orderByPath)
            .layout(options.iterations);


        // thanks http://plnkr.co/edit/cxLlvIlmo1Y6vJyPs6N9?p=preview
        //  http://stackoverflow.com/questions/22924253/adding-pan-zoom-to-d3js-force-directed
        // allow force drag to work with pan/zoom drag
        function dragstart(d) {
          d3.event.sourceEvent.preventDefault();
          d3.event.sourceEvent.stopPropagation();
        }


        function dragmove(d) {
            d3.select(this).attr("transform", 
                    "translate(" + 
                      (d.x = Math.max(0, d3.event.x)) + "," +
                       //d.x + "," +
                      (d.y = Math.max(0, d3.event.y)) + ")");
            sankey.relayout();
            
            // update link path description
            link.attr("d", draw_link);
        }

        // select the svg element and remove existing children or previously set viewBox attribute
        var svg = d3.select(el).select("svg");
        svg.selectAll("*").remove();
        svg.attr("viewBox", null);
        
        // append g for our container to transform by margin
        svg = svg
                .append("g").attr("class","zoom-layer")
                .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");;
                
        // add zooming if requested
        if (options.zoom) {
          zoom.on("zoom", redraw)
          function redraw() {
            d3.select(el).select(".zoom-layer").attr("transform",
            "translate(" + d3.event.transform.x + "," + d3.event.transform.y + ")"+
            " scale(" + d3.event.transform.k + ")");
          }
      
          d3.select(el).select("svg")
            .attr("pointer-events", "all")
            .call(zoom);

          d3.select(el).select("svg").on("dblclick.zoom", null);

  
        } else {
          zoom.on("zoom", null);
 
        }

        // draw path
        var draw_link = sankey.link();
        console.log(draw_link);

        // draw links
        var link = svg.selectAll(".link").data(sankey.links())

        // new objects
        var newLink = link.enter().append("path").attr("class", "link");
        
        link = newLink.merge(link);
            
        function min1_or_dy(d) {
          return Math.max(1, d.dy);
        }

        if (options.linkType != "trapez") {
          link.attr("d", draw_link)
              .style("stroke",         color_link)
              .style("stroke-width",   min1_or_dy)
              .style("stroke-opacity", opacity_link)
              .style("fill",           "none")
        } else {
          link.attr("d", draw_link)
              .style("fill",         color_link)
              .style("fill-opacity", opacity_link);
        }

        
        path_filter = function(path, path1) { 
           return path1.lastIndexOf(path,0) === 0; 
        }

        link
            .sort(function(a, b) { return b.dy - a.dy; })
            .on("mouseover", function(d) {
              var sel = d3.select(this);
              if (options.highlightChildLinks) {
                sel = link.filter(function(d1, i) { return(d == d1 || is_child(d.target, d1)); } )
              }
              sel
                .style("stroke-opacity", function(d){return opacity_link(d) + opacity_link_plus})
                .style("fill-opacity", function(d){return opacity_link(d) + opacity_link_plus});
            })
            .on("mouseout", function(d) {
                var sel = d3.select(this);
                if (options.highlightChildLinks) {
                  sel = link.filter(function(d1, i) { return(d == d1 || is_child(d.target, d1)); } )
                }
                sel
                .style("stroke-opacity", opacity_link)
                .style("fill-opacity", opacity_link);
            });

        // add backwards class to cycles
        link.classed('backwards', function (d) { return d.target.x < d.source.x; });

        svg.selectAll(".link.backwards")
            .style("stroke-dasharray","9,1")
            .style("stroke","#402")

        // draw nodes
        var node = svg.selectAll(".node")
            .data(sankey.nodes())

        // console.log(link);
        // console.log(node);
        
        function is_child (source_node, target_link) {
          if (!source_node.sourceLinks) 
            return false;
          
          for (var i=0; i < source_node.sourceLinks.length; i++) {
            if (source_node.sourceLinks[i] == target_link || is_child(source_node.sourceLinks[i].target, target_link)) {
              return true;
            } 
          }
        }

        var newNode = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" +
                                            d.x + "," + d.y + ")"; })
            .call(d3.drag()
            .subject(function(d) { return d; })
            .on("start", function() { 
                dragstart(this);
                this.parentNode.appendChild(this); 
            })
            .on("drag", dragmove))
            .on("mouseover", function(d) {
                if (options.highlightChildLinks) {
                  link.filter(function(d1, i) { return(is_child(d, d1)); } )
                      .style("stroke-opacity", function(d){return opacity_link(d) + opacity_link_plus})
                      .style("fill-opacity", function(d){return opacity_link(d) + opacity_link_plus});
                }
            })
            .on("mouseout", function(d) {
                if (options.highlightChildLinks) {
                  link.filter(function(d1, i) { return(is_child(d, d1)); } )
                      .style("stroke-opacity", opacity_link)
                      .style("fill-opacity", opacity_link);
                }
            })
            .on("click", function(d) {
                Shiny.onInputChange(el.id + '_clicked', d.name)
            });
        
        node = newNode.merge(node);
        
        // note: u2192 is right-arrow
        link.append("title")
            .text(function(d) { 
                return d.source.name + " \u2192 " + d.target.name +
                " \r\n" + format(d.value) + " " + options.units; });

        node
            .append("rect")
            .attr("height", function(d) { return d.dy; })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
                if (d.targetLinks[0]) {
                  return d.color = color_node(d); 
                  return d.color = d3.rgb(d.targetLinks[0].source.color).darker(1); 
                } else {
                  return d.color = color_node(d); 
                }
                })
            .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
            .style("stroke-width", options.nodeStrokeWidth)
            .style("opacity", 0.9)
            .style("cursor", "move")
            .append("title")
            .attr("class", "tooltip")
            .attr("title", function(d) { return format(d.value); })
            .text(function(d) { 
                return d.name + " \r\n" + format(d.value) + 
                " " + options.units; });

        node
            .append("text")
            .attr("x", - 1)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .style("font-size", options.fontSize + "px")
            .style("font-family", options.fontFamily ? options.fontFamily : "inherit")
            .filter(function(d) { return d.x < width / 2 || (options.align == "none"); })
            .attr("x", 1 + sankey.nodeWidth())
            .attr("text-anchor", "start");


        // adjust viewBox to fit the bounds of our tree
        /* // doesn't work with D3 v4
        var s = d3.select(svg[0][0].parentNode);
        s.attr(
            "viewBox",
            [
              d3.min(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().left
                })
              ) - s.node().getBoundingClientRect().left - margin.right,
              d3.min(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().top
                })
              ) - s.node().getBoundingClientRect().top - margin.top,
              d3.max(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().right
                })
              ) -
              d3.min(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().left
                })
              )  + margin.left + margin.right,
              d3.max(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().bottom
                })
              ) -
              d3.min(
                s.selectAll('g')[0].map(function(d){
                  return d.getBoundingClientRect().top
                })
              ) + margin.top + margin.bottom
            ].join(",")
          );
          */

    },
});
