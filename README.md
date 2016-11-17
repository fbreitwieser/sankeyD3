# D3 JavaScript Sankey Network Graphs from R

Version 0.2

This project is based on the Sankey implementation in [networkD3](https://github.com/christophergandrud/networkD3) and [d3-sankey](https://github.com/d3/d3-sankey).  

Changelog:
 - Based on D3 v4 / https://github.com/d3/d3-sankey 
     - added several modifications from networkD3 sankey.js 
     - included fixes and features from unmerged pull requests:
       - d3/d3-plugins#124: Fix nodesByBreadth to have proper ordering
       - d3/d3-plugins#120: Added 'l-bezier' link type
       - d3/d3-plugins#36: Added 'path1' link type
       - d3/d3-plugins#40: Added 'path2' link type
       - d3/d3-plugins#74: Sort sankey target links by descending slope
       - d3/d3-sankey#4: Add horizontal alignment option to Sankey layout
 - Added option numberFormat, default being ",.5g" (see , fixes christophergandrud/networkD3#147)
 - Added option NodePosX, fixes christophergandrud/networkD3#108 
 - Added option to force node ordering to be alphabetical along a path (only works well with trees with one parent for each node, but might fix christophergandrud/networkD3#153)
 - Zooming
 - Dragging both horizontally and vertically
 - Added option showNodeValues to show node values above nodes
 - Added option nodeCornerRadius for rounded nodes
 - Added option title for titles in the upper-right corner of the plot
 - Added <sankey id>_hover event that is fired every second
 - Added option doubleclickTogglesChildren to hide children/downstram
    nodes
 - Added option xScalingFactor to scale width between nodes
 - Added option xAxisDomain to make an x-axis
 - Added option linkGradient to make link a gradient (when LinkGroup is not defined)
 - Added option linkColor to specify link color
 - Added option linkOpacity to specify opacity of link
 - Added option nodeShadow to add drop shadow
 - Added option nodeLabelMargin to specify the distance between label and node




The `inst/examples/shiny` web-app exposes several of the features:
![image](https://cloud.githubusercontent.com/assets/516060/19533346/5af9a822-960d-11e6-984c-333d20f2451f.png)
 
## Usage

```R
# Recreate Bostock Sankey diagram: http://bost.ocks.org/mike/sankey/
# Load energy projection data
URL <- paste0("https://cdn.rawgit.com/christophergandrud/networkD3/",
              "master/JSONdata/energy.json")
Energy <- jsonlite::fromJSON(URL)

# Plot
sankeyNetwork(Links = Energy$links, Nodes = Energy$nodes, Source = "source",
             Target = "target", Value = "value", NodeID = "name",
             units = "TWh", fontSize = 12, nodeWidth = 30)
```

### Saving to an external file

Use `saveNetwork` to save a network to stand alone HTML file:

```R
library(magrittr)

simpleNetwork(networkData) %>% saveNetwork(file = 'Net1.html')
```
