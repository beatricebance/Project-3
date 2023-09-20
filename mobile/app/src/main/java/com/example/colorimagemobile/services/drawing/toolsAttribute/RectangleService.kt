package com.example.colorimagemobile.services.drawing.toolsAttribute

object RectangleService: Attributes {

    override val minWidth = 1
    override val maxWidth = 50
    override var currentWidth: Int = 0

    private var currentStyle: RectangleStyle = RectangleStyle.WITH_BORDER_FILL

    init {
        initCurrentWidth()
    }

    fun updateBorderStyle(newStyle: RectangleStyle) {
        currentStyle = newStyle
    }

    fun getBorderStyle(): RectangleStyle {
        return currentStyle
    }
}

enum class RectangleStyle {
    WITH_BORDER_FILL,
    NO_BORDER,
    ONLY_BORDER
}