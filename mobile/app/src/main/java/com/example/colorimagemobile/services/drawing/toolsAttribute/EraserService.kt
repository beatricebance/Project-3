package com.example.colorimagemobile.services.drawing.toolsAttribute

object EraserService: Attributes {
    override val minWidth = 1
    override val maxWidth = 50
    override var currentWidth: Int = 0

    init {
        initCurrentWidth()
    }
}