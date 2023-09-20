package com.example.colorimagemobile.models

data class SvgStyle (
    var fill: String = "",
    var fillOpacity: String = "1",
    val fillWidth: Int = 0,
    var stroke: String = "",
    var strokeOpacity: String = "1",
    var strokeWidth: Int = 0,
)

data class Polyline (
    val id: String,
    val name: String,
    var points: String,
    var style: String
)

data class Ellipse (
    val id: String,
    val name: String,
    var cx: String,
    var cy: String,
    var width: String,
    var height: String,
    var rx: String,
    var ry: String,
    var style: String,
)

data class Rectangle (
    val id: String,
    val name: String,
    var x: String,
    var y: String,
    var width: String,
    var height: String,
    var style: String
)

data class BaseSVG(
    val width: String,
    val height: String,
    val style: String,
)

data class CustomSVG(
    val width: String,
    val height: String,
    val style: String,
    var ellipse: ArrayList<Ellipse>?,
    var polyline: ArrayList<Polyline>?,
    var rect: ArrayList<Rectangle>?
)


