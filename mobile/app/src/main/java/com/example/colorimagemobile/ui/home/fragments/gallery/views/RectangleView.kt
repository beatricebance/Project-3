package com.example.colorimagemobile.ui.home.fragments.gallery.views

import android.content.Context
import com.example.colorimagemobile.classes.toolsCommand.RectangleCommand
import com.example.colorimagemobile.models.PencilData
import com.example.colorimagemobile.models.RectangleData
import com.example.colorimagemobile.services.UUIDService
import com.example.colorimagemobile.services.drawing.CanvasService
import com.example.colorimagemobile.services.drawing.PaintPath
import com.example.colorimagemobile.services.drawing.Point
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.example.colorimagemobile.services.drawing.toolsAttribute.RectangleService
import com.example.colorimagemobile.services.drawing.toolsAttribute.RectangleStyle
import com.example.colorimagemobile.services.socket.DrawingSocketService
import kotlin.math.abs

class RectangleView(context: Context?): CanvasView(context) {
    private var rectangleCommand: RectangleCommand? = null
    private val rectangleType = "Rectangle"

    override fun createPathObject() {
        currentX = motionTouchEventX
        currentY = motionTouchEventY
        val id = UUIDService.generateUUID()
        var rectangleStyle = RectangleService.getBorderStyle()
        var fill = "none"
        var stroke = "none"
        var color = ColorService.getPrimaryColorAsString()
        var secondaryColor = ColorService.getSecondaryColorAsString()

        when(rectangleStyle){
            RectangleStyle.WITH_BORDER_FILL -> {
                fill = color // TODO IMPLEMENT PRIMARY AND SECONDARY COLORS
                stroke = secondaryColor
            }
            RectangleStyle.NO_BORDER ->{
                fill = color
            }
            RectangleStyle.ONLY_BORDER -> {
                stroke = secondaryColor
            }
        }

        var rectangleData = RectangleData(
            id = id,
            fill = fill,
            stroke = stroke,
            fillOpacity = ColorService.getAlphaForDesktop(fill),
            strokeOpacity = ColorService.getAlphaForDesktop(stroke),
            strokeWidth = RectangleService.currentWidth,
            x = currentX.toInt(),
            y = currentY.toInt(),
            width = 0,
            height = 0
        )

        rectangleCommand = RectangleCommand(rectangleData)
    }

    override fun onTouchDown() {
        CanvasService.extraCanvas.save()
        createPathObject()
        DrawingSocketService.sendInProgressDrawingCommand(rectangleCommand!!.rectangle, rectangleType)
    }

    override fun onTouchMove() {
        val dx = abs(motionTouchEventX - currentX)
        val dy = abs(motionTouchEventY - currentY)

        // check if finger has moved for real
        if (dx >= touchTolerance || dy >= touchTolerance) {
            currentX = motionTouchEventX
            currentY = motionTouchEventY
            rectangleCommand!!.setEndPoint(Point(currentX, currentY))
            rectangleCommand!!.execute()
            DrawingSocketService.sendInProgressDrawingCommand(rectangleCommand!!.rectangle, rectangleType)
        }
    }

    override fun onTouchUp() {
        DrawingSocketService.sendConfirmDrawingCommand(rectangleCommand!!.rectangle, rectangleType)
        // clean up
        rectangleCommand = null
    }
}