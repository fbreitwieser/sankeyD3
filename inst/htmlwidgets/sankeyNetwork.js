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
        var zoom = d3.zoom().scaleExtent([.75, 3]);    

        var color = eval(options.colourScale);
        
        var color_node = function color_node(d){
          if (d.color) {
            return d.color;
          } else if (d.group){
            return color(d.group);
          } else {
            return options.linkColor;
          }
        }

        var color_link = function color_link(d) {
          if (d.group){
            return color(d.group);
          } else if (options.linkGradient) {
            return "url(#linearLinkGradient)";
          } else {
            return  "#CCCCCC";
          }
        }

        var animation_duration = 50;
        var opacity_node = 1;
        var opacity_link_plus = 0.45;
        
        var opacity_link = function opacity_link(d) {
          if (d.inactive) {
            return 0;
          }
          if (d.group){
            return options.linkOpacity;
          } else {
            return options.linkOpacity;
          }
        }

        format = function(d) { 
          if (options.numberFormat == "pavian") {
            var formated_num;
            if (d > 1000) {
              formated_num = d3.format(".3s")(d);
            } else if (d > 0.001) {
              formated_num = d3.format(".3r")(d);
            } else {
              formated_num = d3.format(".3g")(d);
            }
              
            if (formated_num.indexOf('.') >= 0) {
              if (formated_num.search(/[0-9]$/ >= 0)) {
                formated_num = formated_num.replace(/0+$/, "");
                formated_num = formated_num.replace(/\.$/, "");
              } else {
                formated_num = formated_num.replace(/0+(.)/, "$1");
                formated_num = formated_num.replace(/\.(.)/, "$1");
              }
            }
            
          } else {
            formated_num = d3.format(options.numberFormat)(d);
          }
          return formated_num;
        }
        
        // create d3 sankey layout
        sankey
            .nodes(d3.values(nodes))
            .align(options.align)
            .links(links)
            .size([width, height - 20])
            .linkType(options.linkType)
            .nodeWidth(options.nodeWidth)
            .nodePadding(options.nodePadding)
            .scaleNodeBreadthsByString(options.scaleNodeBreadthsByString)
            .curvature(options.curvature)
            .orderByPath(options.orderByPath)
            .showNodeValues(options.showNodeValues)
            .nodeCornerRadius(options.nodeCornerRadius);
            
        if(options.yOrderComparator) {
          sankey = sankey.yOrderComparator(eval(options.yOrderComparator));
        }

        sankey.layout(options.iterations);

        var max_posX = d3.max(sankey.nodes(), function(d) { return d.posX; });
        sankey.nodes().forEach(function(node) { node.x = node.x * options.xScalingFactor; });

        // thanks http://plnkr.co/edit/cxLlvIlmo1Y6vJyPs6N9?p=preview
        //  http://stackoverflow.com/questions/22924253/adding-pan-zoom-to-d3js-force-directed
        // allow force drag to work with pan/zoom drag
        function dragstart(d) {
          d3.event.sourceEvent.preventDefault();
          d3.event.sourceEvent.stopPropagation();
        }


        function dragmove(d) {
          if (options.dragX || options.dragY) {
            d3.select(this).attr("transform", 
                    "translate(" + 
                      (options.dragX? (d.x = Math.max(0, d3.event.x)) : d.x ) + "," +
                      (options.dragY? (d.y = Math.max(0, d3.event.y)) : d.y ) + ")");
            sankey.relayout();
            
            // update link path description
            link.attr("d", draw_link);
          }
        }

        // select the svg element and remove existing children or previously set viewBox attribute
        var svg = d3.select(el).select("svg");
        svg.selectAll("*").remove();
        svg.attr("viewBox", null);
        
        // append g for our container to transform by margin
        svg = svg
                .append("g").attr("class","zoom-layer")
                .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

        //make defs and add the linear gradient
        // filters go in defs element
        var defs = svg.append("defs");

        if (options.linkGradient) {
          var lg = defs.append("linearGradient")
          .attr("id", "linearLinkGradient")
          .attr("x1", "0%")
          .attr("x2", "100%") // horizontal gradient
          .attr("y1", "0%")
          .attr("y2", "0%");

          lg.append("stop")
          .attr("offset", "0%")
          .style("stop-color", "#A0A0A0")//end in light gray
          .style("stop-opacity", 1)
        
          lg.append("stop")
          .attr("offset", "100%")
          .style("stop-color", "#D0D0D0")//start in dark gray
          .style("stop-opacity", 1)
        }
        
       
        if (options.nodeShadow) {
          // drop shadow definitions from http://bl.ocks.org/cpbotha/5200394
          // create filter with id #drop-shadow
          // height=130% so that the shadow is not clipped
          var filter = defs.append("filter")
              .attr("id", "drop-shadow")
              .attr("height", "130%")
              .attr("width", "130%");
 
          // SourceAlpha refers to opacity of graphic that this filter will be applied to
          // convolve that with a Gaussian with standard deviation 3 and store result
          // in blur
          filter.append("feGaussianBlur")
              .attr("in", "SourceAlpha")
              .attr("stdDeviation", .5)
              .attr("result", "blur");
          
          // translate output of Gaussian blur to the right and downwards with 2px
          // store result in offsetBlur
          filter.append("feOffset")
              .attr("in", "blur")
              .attr("dx", .5)
              .attr("dy", .5)
              .attr("rx", options.nodeCornerRadius)
              .attr("ry", options.nodeCornerRadius)
              .attr("result", "offsetBlur");
          
          // overlay original SourceGraphic over translated blurred opacity by using
          // feMerge filter. Order of specifying inputs is important!
          var feMerge = filter.append("feMerge");
          
          feMerge.append("feMergeNode")
              .attr("in", "offsetBlur")
          feMerge.append("feMergeNode")
              .attr("in", "SourceGraphic");
        }
        
               
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
        
        if (typeof options.title != "undefined") {
          svg.append("text")
            .attr("dy", ".5em")
            .attr("render-order", -1)
            .text(options.title)
            .style("cursor", "move")
            .style("fill", "black")
            .style("font-size", "28px")
            .style("font-family", options.fontFamily ? options.fontFamily : "inherit");
            
        }

        // draw path
        var draw_link = sankey.link();

        // draw links
        var link = svg.selectAll(".link").data(sankey.links())

        // new objects
        var newLink = link.enter().append("path").attr("class", "link");
        
        link = newLink.merge(link);
            
        function min1_or_dy(d) {
          return Math.max(1, d.dy);
        }


        if (options.linkType == "bezier" || options.linkType == "l-bezier") {
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
              if (d.inactive) return;
              var sel = d3.select(this);
              if (options.highlightChildLinks) {
                sel = link.filter(function(d1, i) { return(d == d1 || is_child(d.target, d1)); } )
              }
              sel
                .style("stroke-opacity", function(d){return opacity_link(d) + opacity_link_plus})
                .style("fill-opacity", function(d){return opacity_link(d) + opacity_link_plus});
            })
            .on("mouseout", function(d) {
              if (d.inactive) return;
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

        function is_child (source_node, target_link) {
          for (var i=0; i < source_node.sourceLinks.length; i++) {
            if (source_node.sourceLinks[i] == target_link || is_child(source_node.sourceLinks[i].target, target_link)) {
              return true;
            } 
          }
          return false;
        }
        function is_child_node (source_node, target_node) {
          for (var i=0; i < source_node.sourceLinks.length; i++) {
            if (source_node.sourceLinks[i].target == target_node || is_child_node(source_node.sourceLinks[i].target, target_node)) {
              return true;
            } 
          }
          return false;
        }

        var newNode = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })  // change here if you wanna change
            .call(d3.drag()
            .subject(function(d) { return d; })
            .on("start", function() { 
                dragstart(this);
                this.parentNode.appendChild(this); 
            })
            .on("drag", dragmove))
            .on("mouseover", function(d,i) {
              if (d.inactive) return;
              
              if (options.highlightChildLinks) {
                  link.filter(function(d1, i) { return(is_child(d, d1)); } )
                      .style("stroke-opacity", function(d){return opacity_link(d) + opacity_link_plus})
                      .style("fill-opacity", function(d){return opacity_link(d) + opacity_link_plus});
              }
              
             var t = setTimeout(function() {
               Shiny.onInputChange(el.id + '_hover', d.name);
             }, 1000);
             $(this).data('timeout', t);

            })
            .on("mouseout", function(d,i) {
              clearTimeout($(this).data('timeout')); // Clear hover timeout when the mouse leaves the node

              if (d.inactive) return;
              if (options.highlightChildLinks) {
                  link.filter(function(d1, i) { return(is_child(d, d1)); } )
                      .style("stroke-opacity", opacity_link)
                      .style("fill-opacity", opacity_link);
              }
            })
            .on("click", function(d) {
               Shiny.onInputChange(el.id + '_clicked', d.name);
            })
            .on("dblclick", function(d) {
               Shiny.onInputChange(el.id + '_clicked', d.name);
               if (!options.doubleclickTogglesChildren) {
                 return;
               }
               d.inactive = !d.inactive;

               if (d.inactive) {
                 d3.select(this).selectAll('rect').style("stroke-width",options.nodeStrokeWidth+2)
                 d3.select(this).selectAll('text').style('font-weight', 'bold');
               } else {
                 d3.select(this).selectAll('rect').style("stroke-width",options.nodeStrokeWidth)
                 d3.select(this).selectAll('text').style('font-weight', 'normal');
               }
               
               /* Draft of a transform animation of the links - not working currently
               if (d.inactive) {
                link.filter(function(d1, i) { if(is_child(d, d1)) { d1.inactive = d.inactive; return true; } else { return false; }} )
                 .attr("transform", "scale(1, 1)")
                  .transition().duration(500)
                  .delay(function(d1) { 
                    var delay = (d1.source.posX - d.posX )*100 + 50; 
                    if (!d.inactive) delay = 500 - delay;
                    return delay
                  } )
                  .attr("transform", "scale(0, 1)");
               } else {
                 link.filter(function(d1, i) { if(is_child(d, d1)) { d1.inactive = d.inactive; return true; } else { return false; }} )
                  .attr("transform", "scale(0, 1)")
                  .transition().duration(500)
                  .delay(function(d1) { 
                    var delay = (d1.source.posX - d.posX )*100 + 50; 
                    if (!d.inactive) delay = 500 - delay;
                    return delay
                  } )
                  .attr("transform", "scale(1, 1)");
                  
               } */
               
               var max_delay = (max_posX - d.posX) * animation_duration;
               
               link.filter(function(d1, i) { if(is_child(d, d1)) { d1.inactive = d.inactive; return true; } else { return false; }} )
                 .transition().duration(max_delay)
                  .delay(function(d1) { 
                    var delay = (d1.source.posX - d.posX + .5)*animation_duration; 
                    if (d.inactive) delay = max_delay - delay;
                    return delay
                  } )
                  .style("stroke-opacity", opacity_link)
                  .style("fill-opacity",   opacity_link);
               
               var new_opacity = d.inactive? 0 : opacity_node;
               node.filter(function(d1, i) { if(is_child_node(d, d1)) { d1.inactive = d.inactive; return true; } else { return false; }} )
                  .transition().duration(max_delay)
                  .delay(function(d1) { 
                    var delay = (d1.posX - d.posX + .5)*animation_duration; 
                    if (d.inactive) delay = max_delay - delay;
                    return delay
                  })
                  .style("opacity", new_opacity);
               
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
            .style("opacity", opacity_node )
            .style("cursor", "move")
            .attr("rx", options.nodeCornerRadius)
            .attr("ry", options.nodeCornerRadius)
			.style("filter", function(d) {
                if (options.nodeShadow) { return( "url(#drop-shadow)");  } } )
            .append("title")
            .attr("class", "tooltip")
            .attr("title", function(d) { return format(d.value); })
            .text(function(d) { 
                return d.name + " \r\n" + format(d.value) + 
                " " + options.units; });

        node
            .append("text")
            .attr("x", - options.nodeLabelMargin)
            .attr("y", function(d) { return d.dy / 2; })
            .attr("class", "node-text")
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) { return d.name; })
            .style("cursor", "move")
            .style("fill", function(d) {
              if (d.fontColor) {
                return d.fontColor;
              } else {
                return options.fontColor ? options.fontColor : "inherit";
              }
            })
            .style("font-size", function(d) {
              if (d.fontSize) {
                return d.fontSize;
              } else {
                return options.fontSize + "px";
              }
            })
            .style("font-family", options.fontFamily ? options.fontFamily : "inherit")
            .filter(function(d) { return d.x < width / 2 || (options.align == "none"); })
            .attr("x", options.nodeLabelMargin + sankey.nodeWidth())
            .attr("text-anchor", "start");
            
        if (options.showNodeValues) {
          node
            .append("text")
            .attr("x", sankey.nodeWidth()/2)
            .attr("text-anchor", "middle")
            .attr("dy", "-" + (options.nodeStrokeWidth/2 + 1 ) + "px")
            .attr("transform", null)
            .attr("class", "node-number")
            .text(function(d) { return format(d.value); })
            .style("cursor", "move")
            .style("fill", function(d) {
              if (d.fontColor) {
                return d.fontColor;
              } else {
                return options.fontColor ? options.fontColor : "inherit";
              }
            })
            .style("font-size", function(d) {
              if (d.fontSize) {
                return d.fontSize;
              } else {
                return (options.fontSize - 2) + "px";
              }
            })
            .style("font-family", options.fontFamily ? options.fontFamily : "inherit");
        }
        
        
        // Create an array with values from 1 to max_posX
        //var axis_domain = new Array(max_posX + 1)
        //  .join().split(',')
        //  .map(function(item, index){ return ++index;})

        
        if (options.xAxisDomain) {
          
          var axisXPos = new Array(options.xAxisDomain.length);
          sankey.nodes().forEach(function(node) { axisXPos[node.posX] = node.x + options.nodeWidth/2; });

          var x = d3.scaleOrdinal().domain(options.xAxisDomain).range(axisXPos);
          svg.append("g").attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")")  // move into position
             .call(d3.axisBottom(x));
        }

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
