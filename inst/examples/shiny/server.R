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
                  fontSize = 12, 
                  zoom = input$zoom, align = input$align,
                  scaleNodeBreadthsByString = input$scaleNodeBreadthsByString,
                  nodeWidth = input$nodeWidth,
                  nodeShadow = input$nodeShadow,
                  linkGradient = input$linkGradient,
                  linkOpacity = input$linkOpacity,
                  nodeLabelMargin = input$nodeLabelMargin,
                  nodeStrokeWidth = input$nodeStrokeWidth,
                  LinkGroup = ifelse(input$LinkGroup == "none", NA, input$LinkGroup),
                  NodeGroup = ifelse(input$NodeGroup == "none", NA, input$NodeGroup),
                  nodePadding = input$nodePadding,
                  nodeCornerRadius = input$nodeCornerRadius,
                  showNodeValues = input$showNodeValues,
                  dragX = input$dragX,
                  dragY = input$dragY,
                  linkType = input$linkType,
                  curvature = input$curvature,
                  numberFormat = input$numberFormat,
                  highlightChildLinks = input$highlightChildLinks,
                  doubleclickTogglesChildren = input$doubleclickTogglesChildren,
                  orderByPath = input$orderByPath,
                  xScalingFactor = input$xScalingFactor,
                  units = "kWh")
  })
  
  output$clicked_node <- renderPrint( {
    input$sankey_clicked 
    })
  output$hovered_node <- renderPrint( {
    input$sankey_hover
  })
  
})
