package com.example.colorimagemobile.classes.toolsCommand

import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingJsonService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.toolsAttribute.LineWidthService
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService

class LineWidthCommand(objectId: Int, private var lineWidth: Int): ICommand {
    private var commandToChange: ICommand? = null

    init {
        commandToChange = DrawingObjectManager.getCommand(objectId)
    }

    override fun update(drawingCommand: Any) {
        TODO("Not yet implemented")
    }

    private fun PencilCommand.setLineWidth(newValue: Int) {
        pencil.strokeWidth = newValue
        DrawingJsonService.updatePolylineWidth(pencil)
        initializePaint()
        execute()
    }

    private fun RectangleCommand.setLineWidth(newValue: Int) {
        rectangle.strokeWidth = newValue
        DrawingJsonService.updateRectangleWidth(rectangle)
        setEndPoint(endingPoint!!)
        execute()
    }

    private fun EllipseCommand.setLineWidth(newValue: Int) {
        ellipse.strokeWidth = newValue
        DrawingJsonService.updateEllipseWidth(ellipse)
        setEndPoint(endingPoint!!)
        execute()
    }

    override fun execute() {
        when(commandToChange){
            is PencilCommand -> (commandToChange as PencilCommand).setLineWidth(lineWidth)
            is RectangleCommand -> (commandToChange as RectangleCommand).setLineWidth(lineWidth)
            is EllipseCommand -> (commandToChange as EllipseCommand).setLineWidth(lineWidth)
            else -> {}
        }
        SelectionService.resetBoundingBox()
        CanvasUpdateService.invalidate()
    }

}