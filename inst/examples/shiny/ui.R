library(shiny)
library(sankeyD3)

shinyUI(fluidPage(
  tags$head(
    tags$style(HTML("
      .form-group {
        margin-bottom: 0px;
        display: inline-block;
        background: lightgreen;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 2px;
        margin-bottom: 2px;
      }
      .shiny-input-container:not(.shiny-input-container-inline) {
        width: initial;
      }
      .irs {
        width: 150px;
      }
    "))
  ),
  titlePanel("Shiny sankeyD3 network"),
  fluidRow(
    radioButtons("LinkGroup", "LinkGroup", choices = c("source_name", "target_name", "none"), selected = "none", inline = TRUE),
    radioButtons("NodeGroup", "NodeGroup", choices = c("name", "none"), selected = "name", inline = TRUE),
    radioButtons("linkType", "linkType", selected = "bezier", choices = c("bezier", "l-bezier", "trapez", "path1", "path2"), inline = TRUE),
    radioButtons("align", "align", choices = c("left", "right", "center", "justify", "none"), selected = "justify", inline = TRUE)
  ),
  fluidRow(
    checkboxInput("orderByPath", "orderByPath", value = FALSE),
    checkboxInput("scaleNodeBreadthsByString", "scaleNodeBreadthsByString", value = FALSE),
    checkboxInput("zoom", "zoom", value = TRUE),
    checkboxInput("highlightChildLinks", "highlightChildLinks", value = FALSE),
    checkboxInput("doubleclickTogglesChildren", "doubleclickTogglesChildren", value = FALSE),
    checkboxInput("showNodeValues", "showNodeValues", value = FALSE)
  ),
  fluidRow(
    sliderInput("nodeWidth","nodeWidth", value = 30, min = 0, max = 50),
    sliderInput("nodeStrokeWidth","nodeStrokeWidth", value = 1, min = 0, max = 15),
    sliderInput("nodePadding","nodePadding", value = 10, min = 0, max=50, step = 1),
    sliderInput("nodeCornerRadius","nodeCornerRadius", value = 5, min = 0, max = 15),
    sliderInput("curvature","curvature", value = .5, min = 0, max = 1, step=.1),
    sliderInput("xScalingFactor","xScalingFactor", value = 1, min = 0, max = 3, step=.1)
    
  ),
  fluidRow(textInput("numberFormat", "numberFormat", value = ",.5g")),
  fluidRow(verbatimTextOutput("clicked_node")),
  fluidRow(verbatimTextOutput("hovered_node")),
  fluidRow(
      sankeyNetworkOutput("sankey")
  )
)
)

