package com.example.colorimagemobile.classes.openDrawingCommand

import com.example.colorimagemobile.models.SvgStyle
import com.example.colorimagemobile.models.ToolData

interface ICreateDrawingCommand {
    fun createData(style: SvgStyle): ToolData
    fun execute()
}