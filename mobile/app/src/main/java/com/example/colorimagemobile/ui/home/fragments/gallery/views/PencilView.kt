package com.example.colorimagemobile.ui.home.fragments.gallery.views

import android.content.Context
import com.example.colorimagemobile.classes.toolsCommand.PencilCommand
import com.example.colorimagemobile.models.InProgressPencil
import com.example.colorimagemobile.models.PencilData
import com.example.colorimagemobile.services.UUIDService
import com.example.colorimagemobile.services.drawing.*
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.example.colorimagemobile.services.drawing.toolsAttribute.PencilService
import com.example.colorimagemobile.services.socket.DrawingSocketService
import kotlin.math.abs

class PencilView(context: Context?): CanvasView(context) {

    private var pencilCommand: PencilCommand? = null
    private var inProgressPencil: InProgressPencil? = null
    private val pencilType = "Pencil"
    private var pencil: PencilData? = null

    override fun createPathObject() {
        currentX = motionTouchEventX
        currentY = motionTouchEventY

        val id = UUIDService.generateUUID()
        val point = Point(currentX, currentY)

        pencil = PencilData(
            id = id,
            fill = "none",
            stroke = ColorService.getPrimaryColorAsString(),
            fillOpacity = "1",
            strokeOpacity = ColorService.getAlphaForDesktop(ColorService.getPrimaryColorAsString()),
            strokeWidth = PencilService.currentWidth,
            pointsList = arrayListOf(point),
        )
        // supposed to put the exact width and height of the path drawn...... but wtf how

        pencilCommand = PencilCommand(pencil!!)
    }

    private fun updateCanvas() {
        pencilCommand!!.addPoint(currentX, currentY)
        pencilCommand!!.execute()
    }

    override fun onTouchDown() {
        CanvasService.extraCanvas.save()
        createPathObject()

        updateCanvas()
        inProgressPencil = InProgressPencil(pencil!!.id, Point(currentX, currentY))
        DrawingSocketService.sendInProgressDrawingCommand(pencil!!, pencilType)
    }

    override fun onTouchMove() {
        val dx = abs(motionTouchEventX - currentX)
        val dy = abs(motionTouchEventY - currentY)

        // check if finger has moved for real
        if (dx >= touchTolerance || dy >= touchTolerance) {
            pencilCommand!!.addPoint(currentX, currentY)
            currentX = motionTouchEventX
            currentY = motionTouchEventY

            updateCanvas()
            inProgressPencil!!.point = Point(motionTouchEventX, motionTouchEventY)
            DrawingSocketService.sendInProgressDrawingCommand(inProgressPencil!!, pencilType)
        }
    }

    override fun onTouchUp() {
        updateCanvas()
        DrawingSocketService.sendConfirmDrawingCommand(this.pencil!!, this.pencilType)
        // Clean up properties
        this.pencilCommand = null
        this.inProgressPencil = null
    }
}