package com.example.colorimagemobile.classes.xml_json

import com.example.colorimagemobile.classes.JSONConvertor
import com.github.underscore.lodash.U
import org.json.JSONArray
import org.json.JSONObject

class SVGParser<T>(svgAsString: String, classType: Class<T>) {
    private var svgAsString = svgAsString
    private var svgClass: T? = null
    private val classType = classType

    init {
        parseIntoCustomSVG()
    }

    // converts string to { svg: {} }
    fun getJSON(): String {
        return U.xmlToJson(svgAsString)
    }

    // convert json to <svg></svg>
    fun getXML(): String {
        return U.jsonToXml(getJSON())
    }

    // remove useless substrings or modify string
    private fun modifyExtras(): String {
        var svgString = getJSON()
        svgString = svgString.replace("\"-", "\"")

        return svgString
    }

    // convert the string JSON to our own model
    private fun parseIntoCustomSVG() {
        val svgString = modifyExtras()
        val wholeSVGJson = JSONObject(svgString).getString("svg")
        var svgJSON = JSONObject(wholeSVGJson)
        val svgListJSON = convertObjectsToList(svgJSON.toString())

        svgClass = JSONConvertor.getJSONObject(svgListJSON, classType) as T
    }

    fun String.insert(index: Int, string: String): String {
        return this.substring(0, index) + string + this.substring(index, this.length)
    }

    private fun convertObjectsToList(svgJson: String): String {
        var currentSVG = svgJson
        currentSVG = checkObjectList(currentSVG, "rect")
        currentSVG = checkObjectList(currentSVG, "ellipse")
        currentSVG = checkObjectList(currentSVG, "polyline")

        return currentSVG
    }

    // if shape has {} format, change to [{}]
    private fun checkObjectList(svgJson: String, shape: String): String {
        if (!JSONObject(svgJson).has(shape)) return svgJson

        var shapeJson = JSONObject(svgJson).getString(shape)

        if (shapeJson.startsWith("{")) {
            var arrayJSON = JSONObject(svgJson).remove(shape)
            arrayJSON = JSONObject(svgJson).put(shape, JSONArray().put(JSONObject(shapeJson)))
            return arrayJSON.toString()
        }

        return svgJson
    }

    fun getCustomSVG(): T {
        return svgClass as T
    }

    fun getBackgroundColor(style: String): String {
        return style.replace("background-color: ", "")
    }
}