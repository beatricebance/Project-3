package com.example.colorimagemobile.ui.home.fragments.gallery.views

import android.content.Context
import android.graphics.Path
import android.graphics.drawable.Drawable
import com.example.colorimagemobile.classes.toolsCommand.EllipseCommand
import com.example.colorimagemobile.classes.toolsCommand.PencilCommand
import com.example.colorimagemobile.classes.toolsCommand.RectangleCommand
import com.example.colorimagemobile.classes.toolsCommand.TranslateCommand
import com.example.colorimagemobile.classes.toolsCommand.selectionToolCommands.SelectionCommand
import com.example.colorimagemobile.models.SelectionData
import com.example.colorimagemobile.models.TranslateData
import com.example.colorimagemobile.services.drawing.CanvasService
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.SynchronisationService
import com.example.colorimagemobile.services.drawing.toolsAttribute.AnchorIndexes
import com.example.colorimagemobile.services.drawing.toolsAttribute.LineWidthService
import com.example.colorimagemobile.services.drawing.toolsAttribute.ResizeSelectionService
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService.selectedShape
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService.selectedShapeIndex
import com.example.colorimagemobile.services.socket.DrawingSocketService
import kotlin.math.abs

class SelectionView(context: Context?): CanvasView(context) {
    private var selectionCommand: SelectionCommand? = null
    private var translationCommand: TranslateCommand? = null
    private var translateData: TranslateData? = null

    override fun createPathObject() {
        // for sync
        val id = DrawingObjectManager.getUuid(selectedShapeIndex) ?: return
        var selectionData = SelectionData(
            id = id
        )
        selectionCommand = SelectionCommand(selectionData)
    }

    private fun drawBoundingBox(drawable: Drawable, index: Int, path: Path, strokeWidth: Int?): Boolean {
        val boundingBox = SelectionService.getPathBoundingBox(path)
        val isInsidePath = boundingBox.contains(motionTouchEventX,motionTouchEventY)

        // Check if shape is in preview shapes. If it is
        val uuid = DrawingObjectManager.getUuid(index)
        val isInPreviewShapes = SynchronisationService.isShapeInPreview(uuid)
        if (isInsidePath && !isInPreviewShapes) {
            selectedShape = drawable
            selectedShapeIndex = index
            createPathObject()
            SelectionService.setSelectionBounds(
                boundingBox.left.toInt(),
                boundingBox.top.toInt(),
                boundingBox.right.toInt(),
                boundingBox.bottom.toInt(),
                strokeWidth
            )
            DrawingSocketService.sendStartSelectionCommand(selectionCommand!!.selectionData, "SelectionStart")
        } else {
            selectedShapeIndex = -1
            if(selectionCommand != null){
                DrawingSocketService.sendConfirmSelectionCommand(selectionCommand!!.selectionData, "SelectionStart")
            }
        }
        CanvasUpdateService.invalidate()
        return isInsidePath
    }

    override fun onTouchDown() {
        CanvasService.extraCanvas.save()

        if (SelectionService.getSelectedAnchor(
                motionTouchEventX,
                motionTouchEventY
            ) != AnchorIndexes.NONE
        ) {
            SelectionService.setSelectedAnchor(motionTouchEventX, motionTouchEventY)
            return
        }

        createPathObject()
        SelectionService.clearSelection()
        val numberOfLayers = DrawingObjectManager.numberOfLayers
        for (index in numberOfLayers - 1 downTo 0) {
            val drawable = DrawingObjectManager.getDrawable(index)
            val command = DrawingObjectManager.getCommand(index)
            var isInsidePath = false
            var strokeWidth = 0
            when(command) {
                is PencilCommand -> {
                    strokeWidth = command.pencil.strokeWidth
                    isInsidePath = drawBoundingBox(drawable, index, command.path, strokeWidth)
                }
                is RectangleCommand -> {
                    strokeWidth = command.rectangle.strokeWidth
                    isInsidePath = drawBoundingBox(drawable, index, command.borderPath, null)
                }
                is EllipseCommand -> {
                    strokeWidth = command.ellipse.strokeWidth
                    isInsidePath = drawBoundingBox(drawable, index, command.borderPath, null)
                }
            }
            if(isInsidePath) {
                LineWidthService.updateCurrentWidth(strokeWidth)
                val id = DrawingObjectManager.getUuid(selectedShapeIndex) ?: return
                this.translateData = TranslateData(
                    id = id,
                    deltaX = 0,
                    deltaY = 0
                )
                DrawingSocketService.sendTransformSelectionCommand(translateData!!, "Translation")
                break
            }
        }
        currentX = motionTouchEventX
        currentY = motionTouchEventY
    }

    override fun onTouchMove() {
        // Resizing: touching one of 8 points on bounding box
        if (SelectionService.selectedAnchorIndex != AnchorIndexes.NONE
        ) {
            if (selectedShapeIndex != -1) {
                ResizeSelectionService.onTouchMove(motionTouchEventX, motionTouchEventY)
                SelectionService.resetBoundingBox()
                return
            }
        }

        // Translate only if touched inside of shape
        val dx = motionTouchEventX - currentX
        val dy = motionTouchEventY - currentY

        if (abs(dx) >= touchTolerance || abs(dy) >= touchTolerance) {
            currentX = motionTouchEventX
            currentY = motionTouchEventY

            if (selectedShapeIndex == -1) { return }
            val id = DrawingObjectManager.getUuid(selectedShapeIndex) ?: return
            this.translateData = TranslateData(
                id = id,
                deltaX = (translateData?.deltaX ?: 0) + dx.toInt(),
                deltaY = (translateData?.deltaY ?: 0) + dy.toInt()
            )
            DrawingSocketService.sendTransformSelectionCommand(translateData!!, "Translation")
            translationCommand = TranslateCommand(translateData!!)
            translationCommand!!.setTransformation(dx.toInt(), dy.toInt())
            translationCommand!!.execute()

            SelectionService.resetBoundingBox()
        }
    }

    override fun onTouchUp() {
        ResizeSelectionService.onTouchUp()
    }
}
