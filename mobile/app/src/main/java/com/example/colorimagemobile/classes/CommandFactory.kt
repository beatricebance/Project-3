package com.example.colorimagemobile.classes

import com.example.colorimagemobile.classes.toolsCommand.selectionToolCommands.ResizeCommand
import com.example.colorimagemobile.classes.toolsCommand.*
import com.example.colorimagemobile.classes.toolsCommand.selectionToolCommands.SelectionCommand
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.*

class CommandFactory {

    companion object {
        fun createCommand(commandType: String, toolData: Any): ICommand? {
            when(commandType) {
                "Pencil" -> return PencilCommand(toolData as PencilData)
                "Rectangle" -> return RectangleCommand(toolData as RectangleData)
                "Ellipse" -> return EllipseCommand(toolData as EllipseData)
                "SelectionStart" -> return SelectionCommand(toolData as SelectionData)
                "SelectionResize" -> {
                    var resizeCommand = ResizeCommand((toolData as ResizeData).id)
                    resizeCommand.setScales(toolData.xScaled, toolData.yScaled, toolData.xTranslate, toolData.yTranslate)
                    return resizeCommand
                }
                "Translation" -> {
                    val translateCommand = TranslateCommand(toolData as TranslateData)
                    translateCommand.setTransformation(toolData.deltaX, toolData.deltaY)
                    return translateCommand
                }
            }
            return null
        }
    }
}