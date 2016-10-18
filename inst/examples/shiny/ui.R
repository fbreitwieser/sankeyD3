library(shiny)
library(sankeyD3)

shinyUI(fluidPage(
  
  titlePanel("Shiny sankeyD3 network"),
  
  sidebarLayout(
    sidebarPanel(
      numericInput("opacity", "Opacity", 0.6, min = 0.1, max = 1, step = .1)
    ),
    mainPanel(
      checkboxInput("sinksRight", "sinksRight", value = TRUE),
      checkboxInput("zoom", "zoom", value = FALSE),
      sankeyNetworkOutput("sankey")
    )
  )
))
