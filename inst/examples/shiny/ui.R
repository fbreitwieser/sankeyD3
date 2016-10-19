library(shiny)
library(sankeyD3)

shinyUI(fluidPage(
  
  titlePanel("Shiny sankeyD3 network"),
    
  fluidRow(    
      column(4,radioButtons("LinkGroup", "LinkGroup", choices = c("source_name", "target_name", "none"), selected = "none", inline = TRUE)),
      column(4,radioButtons("NodeGroup", "NodeGroup", choices = c("name", "none"), selected = "name", inline = TRUE)),
      column(4,radioButtons("linkType", "linkType", selected = "bezier", choices = c("bezier", "l-bezier", "trapez"), inline = TRUE))
  ),
  fluidRow(    
    column(4,radioButtons("align", "align", choices = c("left", "right", "center", "justify", "none"), selected = "justify", inline = TRUE)),
    column(4,checkboxInput("scaleNodeBreadthsByString", "scaleNodeBreadthsByString", value = FALSE),
           checkboxInput("zoom", "zoom", value = FALSE)),
    column(4,checkboxInput("highlightChildLinks", "highlightChildLinks", value = FALSE),
            checkboxInput("orderByPath", "orderByPath", value = FALSE))
  ),
  fluidRow(    
      column(4,sliderInput("nodeStrokeWidth","nodeStrokeWidth", value = 1, min = 0, max = 15)),
      column(4,sliderInput("curvature","curvature", value = .5, min = 0, max = 1, step=.1)),
      column(4,textInput("numberFormat", "numberFormat", value = ",.5g"))
  ),
  fluidRow(
      sankeyNetworkOutput("sankey")
    )
))
