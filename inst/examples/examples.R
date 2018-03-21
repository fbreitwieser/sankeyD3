
library(sankeyD3)

# sankeyNetwork
URL <- "https://cdn.rawgit.com/christophergandrud/networkD3/master/JSONdata/energy.json"
Energy <- jsonlite::fromJSON(URL)

# Plot

Energy$nodes$font_color <- c("black", "red", "green")
Energy$nodes$font_size <- 5:10
sankeyNetwork(Links = Energy$links, Nodes = Energy$nodes, Source = "source",
              Target = "target", Value = "value", NodeID = "name",
              fontSize = 12, nodeWidth = 30, 
              NodeColor = "font_color",
              NodeFontColor = "font_color", NodeFontSize = "font_size")

# And with a different font
sankeyNetwork(Links = Energy$links, Nodes = Energy$nodes, Source = "source",
              Target = "target", Value = "value", NodeID = "name",
              fontSize = 12, nodeWidth = 30, fontFamily = "monospace")

# as of 0.2.6 sankeyNetwork supports cycles
# simple network with cycle 5 -> 0
net_cycles <- list(
  links = data.frame(
    source = c(0,0,0,1,1,5),
    target = c(1,2,3,4,5,0),
    value = 10
  ),
  nodes = data.frame(
    name = letters[1:6]
  )
)

# notice how few arguments we need now
# some output but not the nice output I expect
sankeyNetwork(
  net_cycles$links,
  net_cycles$nodes,
  Value = "value"
)
