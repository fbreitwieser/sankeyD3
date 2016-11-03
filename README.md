# Sankey Network Graphs from R

Version 0.2 [![Build Status](https://travis-ci.org/fbreitwieser/sankeyD3.svg?branch=master)](https://travis-ci.org/fbreitwieser/sankeyD3)

This project is based on [networkD3](https://github.com/christophergandrud/networkD3) and [d3-sankey](https://github.com/d3/d3-sankey).  

 - Uses D3 v4
     - adds several modifications from networkD3 sankey.js 
     - includes fixes and features from unmerged pull requests:
       - d3/d3-plugins#124: Fix nodesByBreadth to have proper ordering
       - d3/d3-plugins#120: Added 'l-bezier' link type
       - d3/d3-plugins#36: Added 'path1' link type
       - d3/d3-plugins#40: Added 'path2' link type
       - d3/d3-plugins#74: Sort sankey target links by descending slope
       - d3/d3-sankey#4: Add horizontal alignment option to Sankey layout
 - Adds option numberFormat, default being ",.5g" (see , fixes christophergandrud/networkD3#147)
 - Adds option NodePosX, fixes christophergandrud/networkD3#108 
 - Adds option to force node ordering to be alphabetical along a path (only works well with trees with one parent for each node, but might fix christophergandrud/networkD3#153)
 - Zooming
 - Dragging both horizontally and vertically
 - Adds option showNodeValues to show node values above nodes
 - Adds option nodeCornerRadius for rounded nodes
 - Adds option title for titles in the upper-right corner of the plot
 - Adds <sankey id>_hover event that is fired every second
 - Adds option doubleclickTogglesChildren to hide children/downstram
    nodes
 - Adds option xScalingFactor to scale width between nodes
 - Adds option xAxisDomain to make an x-axis




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
