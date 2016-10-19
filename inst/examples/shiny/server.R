library(shiny)
library(sankeyD3)

data(MisLinks)
data(MisNodes)

shinyServer(function(input, output) {
    
  output$sankey <- renderSankeyNetwork({
    URL <- "https://cdn.rawgit.com/christophergandrud/networkD3/master/JSONdata/energy.json"
    Energy <- jsonlite::fromJSON(URL)
    Energy$links$source_name <- Energy$nodes[Energy$links$source+1, "name"]
    Energy$links$target_name <- Energy$nodes[Energy$links$target+1, "name"]
    sankeyNetwork(Links = Energy$links, Nodes = Energy$nodes, Source = "source",
                  Target = "target", Value = "value", NodeID = "name",
                  fontSize = 12, nodeWidth = 30, 
                  zoom = input$zoom, align = input$align,
                  scaleNodeBreadthsByString = input$scaleNodeBreadthsByString,
                  nodeStrokeWidth = input$nodeStrokeWidth,
                  LinkGroup = ifelse(input$LinkGroup == "none", NA, input$LinkGroup),
                  NodeGroup = ifelse(input$NodeGroup == "none", NA, input$NodeGroup),
                  linkType = input$linkType,
                  curvature = input$curvature,
                  numberFormat = input$numberFormat,
                  highlightChildLinks = input$highlightChildLinks,
                  orderByPath = input$orderByPath,
                  units = "kWh")
  })
  
})
