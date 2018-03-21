#' Save a Sankey network graph to an HTML file
#'
#' Save a sankeyD3 graph to an HTML file for sharing with others. The HTML can
#' include it's dependencies in an adjacent directory or can bundle all
#' dependencies into the HTML file (via base64 encoding).
#'
#' @param network Network to save (e.g. result of calling the function
#'   \code{simpleNetwork}).
#'
#' @inheritParams htmlwidgets::saveWidget
#'
#' @export
saveNetwork <- function(network, file, selfcontained = TRUE) {
  htmlwidgets::saveWidget(network, file, selfcontained)
}