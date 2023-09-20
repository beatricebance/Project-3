package com.example.colorimagemobile.services.drawing.toolsAttribute

import kotlin.math.abs

interface Attributes {
    val minWidth: Int
    val maxWidth: Int
    var currentWidth: Int

    fun initCurrentWidth() {
        currentWidth = abs((minWidth - maxWidth)/2)
    }

    fun getCurrentWidthAsFloat(): Float {
        return currentWidth.toFloat()
    }
}