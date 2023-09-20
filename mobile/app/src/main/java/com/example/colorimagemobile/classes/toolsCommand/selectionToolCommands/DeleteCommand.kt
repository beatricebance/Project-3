package com.example.colorimagemobile.classes.toolsCommand

import android.graphics.drawable.Drawable
import android.graphics.drawable.ShapeDrawable
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingJsonService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService

class DeleteCommand(deletedShape: Drawable): ICommand {
    private var deletedShape = deletedShape

    override fun update(drawingCommand: Any) {
        TODO("Not yet implemented")
    }

    private fun deleteFromJson() {
        val id = DrawingObjectManager.getUuid(SelectionService.selectedShapeIndex)

        when (DrawingObjectManager.getCommand(SelectionService.selectedShapeIndex)) {
            is PencilCommand -> DrawingJsonService.removePolyline(id!!)
            is RectangleCommand -> DrawingJsonService.removeRectangle(id!!)
            is EllipseCommand -> DrawingJsonService.removeEllipse(id!!)
        }
    }

    override fun execute() {
        if (SelectionService.isShapeInitialized() && deletedShape == SelectionService.selectedShape) {
            var emptyShapeDrawable = ShapeDrawable()
            emptyShapeDrawable.paint.alpha = 0

            deleteFromJson()
            DrawingObjectManager.setDrawable(SelectionService.selectedShapeIndex, emptyShapeDrawable)
            DrawingObjectManager.removeCommand(SelectionService.selectedShapeIndex)
            SelectionService.selectedShapeIndex = -1
            SelectionService.selectedShape = ShapeDrawable()
            SelectionService.clearSelection()
        }
        CanvasUpdateService.invalidate()
    }
}