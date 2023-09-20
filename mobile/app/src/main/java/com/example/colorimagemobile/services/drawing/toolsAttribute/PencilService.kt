package com.example.colorimagemobile.services.drawing.toolsAttribute

import android.graphics.Path

object PencilService: Attributes {
    override val minWidth = 1
    override val maxWidth = 40
    override var currentWidth: Int = 0
    var paths: HashMap<Int, Path> = HashMap()

    init {
        initCurrentWidth()
    }
}