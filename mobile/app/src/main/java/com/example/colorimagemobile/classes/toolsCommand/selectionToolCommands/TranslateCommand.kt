package com.example.colorimagemobile.classes.toolsCommand

import android.graphics.Matrix
import android.graphics.Path
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.SyncUpdate
import com.example.colorimagemobile.models.TranslateData
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager

class TranslateCommand(translateData: TranslateData): ICommand {
    private var deltaX : Int = 0
    private var deltaY: Int = 0

    private var commandToTranslate: ICommand? = null

    override fun update(drawingCommand: Any) {
        setTransformation((drawingCommand as TranslateData).deltaX, drawingCommand.deltaY)
    }

    init{
        commandToTranslate = DrawingObjectManager.getCommand(translateData.id)
    }

    private fun PencilCommand.translate() {
        val translationMatrix = Matrix()
        translationMatrix.setTranslate(deltaX.toFloat(), deltaY.toFloat())
        path.transform(translationMatrix)
        execute()
    }

    private fun RectangleCommand.translate() {
        val translationMatrix = Matrix()
        translationMatrix.setTranslate(deltaX.toFloat(), deltaY.toFloat())
        borderPath.transform(translationMatrix)
        fillPath.transform(translationMatrix)
        execute()
    }

    private fun EllipseCommand.translate() {
        val translationMatrix = Matrix()
        translationMatrix.setTranslate(deltaX.toFloat(), deltaY.toFloat())
        borderPath.transform(translationMatrix)
        fillPath.transform(translationMatrix)
        execute()
    }

    fun setTransformation(x: Int, y: Int) {
        this.deltaX = x
        this.deltaY = y
    }

    override fun execute() {
        when(commandToTranslate){
            is PencilCommand -> (commandToTranslate as PencilCommand).translate()
            is RectangleCommand -> (commandToTranslate as RectangleCommand).translate()
            is EllipseCommand -> (commandToTranslate as EllipseCommand).translate()
            else -> {}
        }
        CanvasUpdateService.invalidate()
    }
}