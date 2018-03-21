
library(sankeyD3)
library(d3r)

# sankeyNetwork
URL <- "https://cdn.rawgit.com/christophergandrud/networkD3/master/JSONdata/energy.json"
Energy <- jsonlite::fromJSON(URL)

# Plot

Energy$nodes$font_color <- c("black", "red", "green")
Energy$nodes$font_size <- 5:10
sankeyNetwork(Links = Energy$links, Nodes = Energy$nodes, Source = "source",
              Target = "target", Value = "value", NodeID = "name",
              fontSize = 12, nodeWidth = 30, 
              NodeColor = "font_color", linkStrokeWidth = 10,
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


my_data = structure(list(my_nodes = structure(list(my_name = c("0 AEP7 Brazil Prod", 
                                                     "1 eldmppbcc01", "2 poamppbcc01", "3 ESCR_Brazil_Portuguese", 
                                                     "4 ProSupport_Brazil", "5 AOS_Brazil"), ID = 0:5, group = c("0 ", 
                                                                                                                 "1 ", "2 ", "3 ", "4 ", "5 ")), class = "data.frame", .Names = c("my_name", 
                                                                                                                                                                                  "ID", "group"), row.names = c(NA, -6L)), my_links = structure(list(
                                                                                                                                                                                    key = c("0_1", "0_2", "1_3", "1_4", "1_5", "2_3", "2_4", 
                                                                                                                                                                                            "2_5", "3_4", "4_3", "4_5", "5_3", "5_4"), source = c(0L, 
                                                                                                                                                                                                                                                  0L, 1L, 1L, 1L, 2L, 2L, 2L, 3L, 4L, 4L, 5L, 5L), target = c(1L, 
                                                                                                                                                                                                                                                                                                              2L, 3L, 4L, 5L, 3L, 4L, 5L, 4L, 3L, 5L, 3L, 4L), total = c(1894L, 
                                                                                                                                                                                                                                                                                                                                                                         1982L, 1499L, 203L, 192L, 1571L, 217L, 194L, 3L, 2L, 2L, 
                                                                                                                                                                                                                                                                                                                                                                         3L, 1L)), class = "data.frame", row.names = c(NA, -13L), .Names = c("key", 
                                                                                                                                                                                                                                                                                                                                                                                                                                             "source", "target", "total"))), .Names = c("my_nodes", "my_links"
                                                                                                                                                                                                                                                                                                                                                                                                                                             ))
sankeyNetwork(Links = my_data$my_links, Nodes = my_data$my_nodes, Source = "source",
              Target = "target", Value = "total", NodeID = "my_name",
              units = "calls")
