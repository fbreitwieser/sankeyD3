library(shiny)
library(sankeyD3)

shinyUI(fluidPage(
  tags$head(
    tags$style(HTML("
      .form-group {
        display: inline-block;
        vertical-align: top;
        background: #f0f0f0;
        padding-left: 10px;
        padding-right: 10px;
        padding-bottom: 5px;
        padding-top: 5px;
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
  titlePanel(paste0("Shiny sankeyD3 network v",packageVersion("sankeyD3"))),
  fluidRow(
    radioButtons("LinkGroup", "LinkGroup", choices = c("source_name", "target_name", "none"), selected = "none", inline = TRUE),
    radioButtons("NodeGroup", "NodeGroup", choices = c("name", "none"), selected = "name", inline = TRUE),
    radioButtons("linkType", "linkType", selected = "bezier", choices = c("bezier", "l-bezier", "trapez", "path1", "path2"), inline = TRUE),
    radioButtons("align", "align", choices = c("left", "right", "center", "justify", "none"), selected = "justify", inline = TRUE),
    checkboxInput("orderByPath", "orderByPath", value = FALSE),
    checkboxInput("scaleNodeBreadthsByString", "scaleNodeBreadthsByString", value = FALSE),
    checkboxInput("zoom", "zoom", value = TRUE),
    checkboxInput("highlightChildLinks", "highlightChildLinks", value = FALSE),
    checkboxInput("doubleclickTogglesChildren", "doubleclickTogglesChildren", value = FALSE),
    checkboxInput("showNodeValues", "showNodeValues", value = FALSE),
    checkboxInput("linkGradient", "linkGradient", value = FALSE),
    checkboxInput("nodeShadow", "nodeShadow", value = FALSE),
    checkboxInput("dragX", "dragX", value = FALSE),
    checkboxInput("dragY", "dragY", value = FALSE),
    sliderInput("nodeWidth","nodeWidth", value = 30, min = 0, max = 50),
    sliderInput("nodeStrokeWidth","nodeStrokeWidth", value = 1, min = 0, max = 15),
    sliderInput("nodePadding","nodePadding", value = 10, min = 0, max=50, step = 1),
    sliderInput("nodeCornerRadius","nodeCornerRadius", value = 5, min = 0, max = 15),
    sliderInput("nodeLabelMargin","nodeLabelMargin", value = 2, min = 0, max = 10, step = 1),
    sliderInput("linkOpacity","linkOpacity", value = .5, min = 0, max = 1, step=.1),
    sliderInput("curvature","curvature", value = .5, min = 0, max = 1, step=.1),
    sliderInput("xScalingFactor","xScalingFactor", value = 1, min = 0, max = 3, step=.1),
    textInput("numberFormat", "numberFormat", value = ",.5g"),
    textInput("linkColor", "linkColor", value = "#ccc")
  ),
  fluidRow(verbatimTextOutput("clicked_node")),
  fluidRow(verbatimTextOutput("hovered_node")),
  fluidRow(
      sankeyNetworkOutput("sankey")
  )
)
)

