#' Scientific Journal and Sci-Fi Themed Color Palettes for 'sankeyNetwork'
#' @description Scientific Journal and Sci-Fi Themed Color Palettes for
#'   'sankeyNetwork'.
#' @param palette Palette type. Details see `pal_*` function in
#'   [ggsci][ggsci::ggsci-package]
#' @param alpha Transparency level, a real number in (0, 1].
#' @param breaks a set of data values to be mapped.
#' @seealso [scale_d3_manual]
#' @name scale-d3
NULL

#' @rdname scale-d3
#' @aliases scale_d3_aaas
#' @export
scale_d3_aaas <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_aaas(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_cosmic
#' @export
scale_d3_cosmic <- function(palette = c("hallmarks_light", "hallmarks_dark", "signature_substitutions"), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_cosmic(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_d3
#' @export
scale_d3_d3 <- function(palette = c(
                            "category10", "category20", "category20b",
                            "category20c"
                        ), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_d3(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_futurama
#' @export
scale_d3_futurama <- function(palette = "planetexpress", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_futurama(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_gsea
#' @export
scale_d3_gsea <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_gsea(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_igv
#' @export
scale_d3_igv <- function(palette = c("default", "alternating"), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_igv(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_jama
#' @export
scale_d3_jama <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_jama(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_jco <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_jco(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_lancet <- function(palette = "lanonc", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_lancet(palette, alpha = alpha),
        breaks = breaks
    )
}


#' @rdname scale-d3
#' @export
scale_d3_locuszoom <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_locuszoom(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_material <- function(palette = c(
                                  "red", "pink", "purple",
                                  "deep-purple", "indigo", "blue",
                                  "light-blue", "cyan", "teal", "green",
                                  "light-green", "lime", "yellow",
                                  "amber", "orange", "deep-orange",
                                  "brown", "grey", "blue-grey"
                              ), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_material(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_nejm <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_nejm(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_npg <- function(palette = "nrc", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_npg(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_rickandmorty <- function(palette = "schwifty", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_rickandmorty(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_simpsons <- function(palette = "springfield", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_simpsons(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_startrek <- function(palette = "uniform", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_startrek(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_tron <- function(palette = "legacy", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_tron(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @export
scale_d3_uchicago <- function(palette = c("default", "light", "dark"), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_uchicago(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_uchicago
#' @export
scale_d3_uchicago <- function(palette = c("default", "light", "dark"), alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_uchicago(palette, alpha = alpha),
        breaks = breaks
    )
}

#' @rdname scale-d3
#' @aliases scale_d3_ucscgb
#' @export
scale_d3_ucscgb <- function(palette = "default", alpha = 1, breaks = NULL) {
    scale_d3_fn(
        ggsci::pal_ucscgb(palette, alpha = alpha),
        breaks = breaks
    )
}

scale_d3_fn <- function(fn, breaks = NULL) {
    structure(
        list(
            fn = fn,
            breaks = breaks
        ),
        class = c("d3_scales_fn", "d3_scales")
    )
}

#' Create your own d3 color scale
#' These functions allow you to specify your own set of mappings from data
#' values to aesthetic values.
#' @param values a set of values to map data values to. The values will be
#'   matched in order (usually alphabetical) with the levels of the data values,
#'   or with breaks if provided. If this is a named vector, then the values will
#'   be matched based on the names instead.
#' @param breaks a set of data values to be mapped.
#' @export
scale_d3_manual <- function(values, breaks = NULL) {
    structure(
        list(
            values = as.character(values),
            breaks = breaks
        ),
        class = c("d3_scales_chr", "d3_scales")
    )
}

is_d3_scales <- function(x) {
    inherits(x, "d3_scales")
}

build_d3_scales <- function(scales) {
    domain <- scales$breaks
    if (inherits(scales, "d3_scales_fn")) {
        range <- scales$fn(length(domain))
    } else {
        range <- scales$values
    }
    if (!identical(length(domain), length(range))) {
        warning("Inconsistent length of palette values and breaks")
    }
    range <- paste0("\"", range, "\"", collapse = ", ")
    range <- paste0("[", range, "]")
    domain <- paste0("\"", domain, "\"", collapse = ", ")
    domain <- paste0("[", domain, "]")
    sprintf(
        "d3.scaleOrdinal().domain(%s).range(%s)",
        domain, range
    )
}
