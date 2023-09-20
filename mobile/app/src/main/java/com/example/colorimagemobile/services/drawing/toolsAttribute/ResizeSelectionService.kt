package com.example.colorimagemobile.services.drawing.toolsAttribute

import android.graphics.*
import com.example.colorimagemobile.classes.toolsCommand.EllipseCommand
import com.example.colorimagemobile.classes.toolsCommand.PencilCommand
import com.example.colorimagemobile.classes.toolsCommand.RectangleCommand
import com.example.colorimagemobile.classes.toolsCommand.selectionToolCommands.ResizeCommand
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.socket.DrawingSocketService

object ResizeSelectionService {

    var resizeCommand: ResizeCommand? = null
    var anchorPoint: PointF? = null
    private var lastXScale: Float = 1f
    private var lastYScale: Float = 1f

    fun onTouchMove(motionTouchEventX: Float, motionTouchEventY: Float) {
        var command: ICommand = DrawingObjectManager.getCommand(SelectionService.selectedShapeIndex)
            ?: return

        if (resizeCommand == null) {
            var objectId = when(command) {
                is PencilCommand -> command.pencil.id
                is EllipseCommand -> command.ellipse.id
                is RectangleCommand -> command.rectangle.id
                else -> return
            }
            resizeCommand = ResizeCommand(objectId)
            setAnchorPoint(resizeCommand!!.getPathBounds())
        }
        resize(motionTouchEventX, motionTouchEventY, resizeCommand!!.getOriginalPathBounds())
    }

    fun onTouchUp(){
        SelectionService.selectedAnchorIndex = AnchorIndexes.NONE
        lastXScale = 1f
        lastYScale = 1f
        resizeCommand = null
    }

    private fun setAnchorPoint(pathRect: RectF){
        anchorPoint = when(SelectionService.selectedAnchorIndex){
            AnchorIndexes.NONE -> null
            AnchorIndexes.TOP_LEFT -> PointF(pathRect.right, pathRect.bottom)
            AnchorIndexes.TOP -> PointF(pathRect.centerX(), pathRect.bottom)
            AnchorIndexes.TOP_RIGHT -> PointF(pathRect.left, pathRect.bottom)
            AnchorIndexes.LEFT -> PointF(pathRect.right, pathRect.centerY())
            AnchorIndexes.RIGHT -> PointF(pathRect.left, pathRect.centerY())
            AnchorIndexes.BOTTOM_LEFT -> PointF(pathRect.right, pathRect.top)
            AnchorIndexes.BOTTOM -> PointF(pathRect.centerX(), pathRect.top)
            AnchorIndexes.BOTTOM_RIGHT -> PointF(pathRect.left, pathRect.top)
        }
    }

    private fun resize(motionTouchEventX: Float, motionTouchEventY: Float, oldRect: RectF){
        if(resizeCommand != null){
            var scaleReturn = ResizeData(IScale(1f, 1f), PointF(0f, 0f))

            if(anchorPoint == null) return
            var resizeData = when(SelectionService.selectedAnchorIndex){
                AnchorIndexes.NONE -> scaleReturn
                AnchorIndexes.TOP_LEFT -> topLeftResize(motionTouchEventX, motionTouchEventY, oldRect)
                AnchorIndexes.TOP -> topResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.TOP_RIGHT -> topRightResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.LEFT -> leftResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.RIGHT -> rightResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.BOTTOM_LEFT -> bottomLeftResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.BOTTOM -> bottomResize(motionTouchEventX, motionTouchEventY,oldRect)
                AnchorIndexes.BOTTOM_RIGHT -> bottomRightResize(motionTouchEventX, motionTouchEventY,oldRect)
            }
            resizeCommand!!.setScales(resizeData.scale.xScale, resizeData.scale.yScale, resizeData.anchorPoint.x, resizeData.anchorPoint.y)
            resizeCommand!!.execute()

            var resizeSocketData = com.example.colorimagemobile.models.ResizeData(
                resizeCommand!!.id,
                resizeData.scale.xScale,
                resizeData.scale.yScale,
                resizeData.anchorPoint.x,
                resizeData.anchorPoint.y,
                resizeCommand!!.getPreviousTransformation()
            )

            DrawingSocketService.sendTransformSelectionCommand(resizeSocketData, "SelectionResize")
            lastXScale = resizeData.scale.xScale
            lastYScale = resizeData.scale.yScale
        }
    }

    private fun getScales(oldRect: RectF, newRect: RectF): IScale{

        var newWidth = newRect.width()
        var newHeight = newRect.height()
        var originalWidth = oldRect.width()
        var originalHeight = oldRect.height()

        var xScale = newWidth / originalWidth
        var yScale = newHeight / originalHeight

        return IScale(xScale, yScale)
    }

    private fun topLeftResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = motionTouchEventX
        var newRight = oldRect.right
        var newTop = motionTouchEventY
        var newBottom = oldRect.bottom
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun topResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = oldRect.left
        var newRight = oldRect.right
        var newTop = motionTouchEventY
        var newBottom = oldRect.bottom
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun topRightResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = oldRect.left
        var newRight = motionTouchEventX
        var newTop = motionTouchEventY
        var newBottom = oldRect.bottom
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun leftResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = motionTouchEventX
        var newRight = oldRect.right
        var newTop = oldRect.top
        var newBottom = oldRect.bottom
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun rightResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = oldRect.left
        var newRight = motionTouchEventX
        var newTop = oldRect.top
        var newBottom = oldRect.bottom
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun bottomLeftResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = motionTouchEventX
        var newRight = oldRect.right
        var newTop = oldRect.top
        var newBottom = motionTouchEventY
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun bottomResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = oldRect.left
        var newRight = oldRect.right
        var newTop = oldRect.top
        var newBottom = motionTouchEventY
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }

    private fun bottomRightResize(motionTouchEventX: Float, motionTouchEventY:Float, oldRect: RectF): ResizeData{
        var newLeft = oldRect.left
        var newRight = motionTouchEventX
        var newTop = oldRect.top
        var newBottom = motionTouchEventY
        var newRect = RectF(newLeft, newTop, newRight, newBottom)

        var scale = getScales(oldRect, newRect)
        return ResizeData(scale, anchorPoint!!)
    }


    private data class IScale (
        var xScale: Float,
        var yScale: Float
    )

    private data class ResizeData(
        var scale: IScale,
        var anchorPoint: PointF
    )
}
