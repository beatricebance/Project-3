package com.example.colorimagemobile.services.drawing.toolsAttribute

import android.graphics.Color
import com.example.colorimagemobile.utils.CommonFun.Companion.removeWhitespace
import com.example.colorimagemobile.utils.Constants
import java.lang.StringBuilder

object ColorService {
    private var primaryColor: String = Constants.DRAWING.PRIMARY_COLOR
    private var secondaryColor: String = Constants.DRAWING.SECONDARY_COLOR

    fun setPrimaryColor(newColor: String) {
        primaryColor = newColor
    }

    fun setSecondaryColor(newColor: String){
        secondaryColor = newColor
    }

    fun getPrimaryColorAsString(): String {
        return primaryColor
    }

    fun getSecondaryColorAsString(): String {
        return secondaryColor
    }

    fun getPrimaryColorAsInt(): Int {
        return rgbaToInt(primaryColor)
    }

    fun getSecondaryColorAsInt(): Int{
        return rgbaToInt(secondaryColor)
    }

    fun swapColors() {
        val tempPrimary = primaryColor
        primaryColor = secondaryColor
        secondaryColor = tempPrimary
    }

    // convert rgb() to Android Color in Integer
    fun rgbaToInt(color: String): Int {
        val rgbValues = color.substring(color.indexOf('(') + 1, color.indexOf(')'))
        val splitRGB = removeWhitespace(rgbValues).split(",")
        var alpha = if (splitRGB.size == 4) {
            if (splitRGB[3].toFloat() < 1)  (splitRGB[3].toFloat() * 255).toInt() else splitRGB[3].toInt()
        } else Constants.DRAWING.MAX_OPACITY

        return Color.argb(alpha, splitRGB[0].toInt(), splitRGB[1].toInt(), splitRGB[2].toInt())
    }

    fun intToRGBA(color: Int): String {
        val red = Color.red(color)
        val green = Color.green(color)
        val blue = Color.blue(color)
        val alpha = Color.alpha(color)

        return "rgba($red, $green, $blue, $alpha)"
    }

    // convert alpha from 0-255 (leger) to 0-1 (lourd)
    fun getAlphaForDesktop(color: String): String {
        if (color == "none") return "none"

        val rgbaValues = color.substring(color.indexOf('(') + 1, color.indexOf(')'))
        val splitRGBA = rgbaValues.replace("\\s".toRegex(),"").split(",")
        val currentAlpha = if (splitRGBA.size == 4) splitRGBA[3].toInt() else Constants.DRAWING.MAX_OPACITY

        val alpha = currentAlpha.toDouble() / Constants.DRAWING.MAX_OPACITY
        return alpha.toString()
    }

    // adds alpha ranging from 0-1 to 0-255 to rgba string
    fun addAlphaToRGBA(color: String, opacity: String): String {
        if (color == "none") return "none"

        val closeParenIndex = color.indexOf(")")
        val transformedColor = StringBuilder(color)

        val newOpacity = convertOpacityToAndroid(opacity)
        transformedColor.insert(closeParenIndex, ", $newOpacity")

        return transformedColor.toString()
    }

    // convert 0-1 to 0-255
    fun convertOpacityToAndroid(opacity: String): Int {
        if (opacity == "none") return Constants.DRAWING.MAX_OPACITY

        return (opacity.toFloat() * Constants.DRAWING.MAX_OPACITY).toInt()
    }
}