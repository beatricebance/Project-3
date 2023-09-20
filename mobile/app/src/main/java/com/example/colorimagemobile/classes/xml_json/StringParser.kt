package com.example.colorimagemobile.classes.xml_json

import com.example.colorimagemobile.models.SvgStyle
import com.example.colorimagemobile.models.ToolData
import com.example.colorimagemobile.utils.CommonFun.Companion.removeWhitespace

class StringParser {

    companion object {

        // convert "8px" to 8 but surely there is more solid way
        fun removePX(value: String): Int {
            val pxValue = value.replace("\\s".toRegex(),"")
            return pxValue.dropLast(2).toFloat().toInt()
        }

        // parse "style":"stroke-width: 8px; fill: none; .." into SvgStyle object
        fun getStyles(styleString: String): SvgStyle {
            val svgStyle: SvgStyle = SvgStyle()

            styleString.split(";").forEach { slicedStyle ->
                val style = removeWhitespace(slicedStyle).split(":")

                if (style.size == 2) {
                    val value = style[1]

                    when (style[0]) {
                        "stroke-width" -> svgStyle.strokeWidth = removePX(value)
                        "fill" -> svgStyle.fill = value
                        "fill-opacity" -> svgStyle.fillOpacity = value
                        "stroke" -> svgStyle.stroke = value
                        "stroke-opacity" -> svgStyle.strokeOpacity = value
                    }
                }
            }

            return svgStyle
        }

        fun buildStyle(toolData: ToolData): String {
            return "stroke: ${toolData.stroke}; " +
                   "stroke-width: ${toolData.strokeWidth}px; " +
                   "stroke-opacity: ${toolData.strokeOpacity}; " +
                   "fill: ${toolData.fill}; " +
                   "fill-opacity: ${toolData.fillOpacity}; "
        }
    }
}