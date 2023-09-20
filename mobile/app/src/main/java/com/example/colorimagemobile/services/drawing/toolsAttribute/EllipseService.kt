package com.example.colorimagemobile.services.drawing.toolsAttribute

object EllipseService: Attributes {
    override val minWidth = 1
    override val maxWidth = 50
    override var currentWidth: Int = 0

    private var currentStyle: EllipseStyle = EllipseStyle.WITH_BORDER_FILL

    init {
        initCurrentWidth()
    }

    fun updateBorderStyle(newStyle: EllipseStyle) {
        currentStyle = newStyle
    }

    fun getBorderStyle(): EllipseStyle {
        return currentStyle
    }
}

enum class EllipseStyle {
    WITH_BORDER_FILL,
    NO_BORDER,
    ONLY_BORDER
}
