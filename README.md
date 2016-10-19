# D3 JavaScript Sankey Network Graphs from R

Version 0.1

This project is based on the Sankey implementation in [networkD3](https://github.com/christophergandrud/networkD3) and [d3-sankey](https://github.com/d3/d3-sankey).  

Changelog:
 - ported to D3 v4
 - based on https://github.com/d3/d3-sankey 
     - added several modifications from networkD3 sankey.js 
     - included fixes and features from unmerged pull requests:
       - d3/d3-plugins#124: Fix nodesByBreadth to have proper ordering
       - d3/d3-plugins#120: Added 'l-bezier' link type
       - d3/d3-plugins#74: Sort sankey target links by descending slope
       - d3/d3-sankey#4: Add horizontal alignment option to Sankey layout
 - added option numberFormat, default being ",.5g" (see , fixes #147)
 - added option NodePosX, fixes #108 
 - added option to force node ordering to be alphabetical along a path (only works well with trees with one parent for each node, but might fix #153)

 
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
