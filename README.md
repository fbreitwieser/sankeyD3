# D3 JavaScript Sankey Network Graphs from R

Version 0.1

This project is based on the Sankey implementation in [networkD3](https://github.com/christophergandrud/networkD3) and [d3-sankey](https://github.com/d3/d3-sankey).  

Differences to sankeyNetwork in networkD3:
 - Based on d3 v4
 
## Usage

Here's `sankeyNetwork` using a downloaded JSON data file:

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