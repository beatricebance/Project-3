package com.example.colorimagemobile.classes.toolsCommand

import android.graphics.Paint
import android.graphics.Path
import android.graphics.Rect
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.PathShape
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.PencilData
import com.example.colorimagemobile.models.SyncUpdate
import com.example.colorimagemobile.services.drawing.*
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.example.colorimagemobile.services.drawing.toolsAttribute.PencilService

class PencilCommand(pencilData: PencilData): ICommand {
    var path: Path = Path()
    var pencil: PencilData = pencilData
    private var layerIndex: Int = -1
    private var boundingRectangle = Rect(0,0, CanvasService.extraCanvas.width, CanvasService.extraCanvas.height)
    private var paint: Paint = Paint()

    init{
        val pathShape = PathShape(Path(),
            CanvasService.extraCanvas.width.toFloat(), CanvasService.extraCanvas.height.toFloat())

        var shapeDrawable = ShapeDrawable(pathShape)
        layerIndex = DrawingObjectManager.addLayer(shapeDrawable, pencil.id)
        PencilService.paths.putIfAbsent(layerIndex, path)

        this.initializePaint()
        this.setStartingPoint()
        DrawingJsonService.createPolyline(pencil)
    }

    fun initializePaint() {
        paint.color = ColorService.rgbaToInt(this.pencil.stroke)
        if(this.pencil.strokeOpacity != "none"){
            paint.alpha = ColorService.convertOpacityToAndroid(this.pencil.strokeOpacity)
        }
        paint.style = Paint.Style.STROKE
        paint.strokeJoin = Paint.Join.ROUND
        paint.strokeCap = Paint.Cap.ROUND
        paint.strokeWidth = this.pencil.strokeWidth.toFloat()
    }

    private fun setStartingPoint(){
        this.path.moveTo(pencil.pointsList[0].x, pencil.pointsList[0].y)
    }

    fun addPoint(x: Float, y: Float) {
        val point = Point(x, y)
        pencil.pointsList.add(point)
        this.path.lineTo(point.x, point.y)
        DrawingJsonService.addPointToPolyline(pencil.id, point)
    }

    // for synchro
    override fun update(drawingCommand: Any) {
        if(drawingCommand is SyncUpdate){
            this.addPoint(drawingCommand.point.x, drawingCommand.point.y)
        }
    }

    private fun getPathDrawable(): ShapeDrawable {
        return DrawingObjectManager.getDrawable(this.layerIndex) as ShapeDrawable
    }

    // update canvas
    override fun execute() {
        val pathShape = PathShape(path,
            CanvasService.extraCanvas.width.toFloat(), CanvasService.extraCanvas.height.toFloat()
        )

        var shapeDrawable = ShapeDrawable(pathShape)
        this.getPathDrawable().bounds = this.boundingRectangle
        DrawingObjectManager.setDrawable(layerIndex, shapeDrawable)
        PencilService.paths[layerIndex] = path // TODO Try to replace this line for the drawingObjectManager.addCOmmand
        DrawingObjectManager.addCommand(pencil.id, this)

        this.getPathDrawable().paint.set(this.paint)
        CanvasUpdateService.invalidate()
    }
}