package com.example.colorimagemobile.classes.toolsCommand

import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.*
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.PathShape
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.EllipseData
import com.example.colorimagemobile.models.EllipseUpdate
import com.example.colorimagemobile.services.drawing.*
import com.example.colorimagemobile.services.drawing.Point
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService

class EllipseCommand(ellipseData: EllipseData): ICommand {
    private var boundingRectangle = Rect(0,0, CanvasService.extraCanvas.width, CanvasService.extraCanvas.height)

    private var startingPoint: Point? = null
    var endingPoint: Point? = null

    private var layerIndex: Int = -1
    private var fillEllipseIndex: Int = -1
    var borderEllipseIndex: Int = -1

    var ellipse: EllipseData = ellipseData

    private lateinit var ellipseShape: LayerDrawable

    private var borderPaint: Paint = Paint()
    private var fillPaint: Paint = Paint()

    var borderPath = Path()
    var fillPath = Path()
    init{
        var borderEllipse = createNewEllipse()
        var fillEllipse = createNewEllipse()
        initializeEllipseLayers(fillEllipse, borderEllipse)

        borderPaint = initializePaint(this.ellipse.stroke, ellipseData.strokeOpacity, Color.WHITE)
        fillPaint = initializePaint(this.ellipse.fill, ellipseData.fillOpacity, Color.BLACK)

        setStartPoint(Point(ellipse.x.toFloat(), ellipse.y.toFloat()))
        DrawingJsonService.createEllipse(ellipse)
    }

    private fun initializePaint(color: String, opacity: String, defaultColor: Int): Paint{
        var paint = Paint()

        val transformedColor = ColorService.addAlphaToRGBA(color, opacity)
        paint.color = if(color != "none") ColorService.rgbaToInt(transformedColor) else defaultColor
        paint.alpha = ColorService.convertOpacityToAndroid(opacity)
        paint.isAntiAlias = true
        paint.style = Paint.Style.FILL
        paint.isDither = true
        return paint
    }

    private fun initializeEllipseLayers(fillRectangle: ShapeDrawable, borderRectangle: ShapeDrawable) {
        var ellipseShapeArray = arrayOf<Drawable>()
        ellipseShape = LayerDrawable(ellipseShapeArray)

        fillEllipseIndex = ellipseShape.addLayer(fillRectangle)
        borderEllipseIndex = ellipseShape.addLayer(borderRectangle)
        layerIndex = DrawingObjectManager.addLayer(ellipseShape, ellipse.id)
    }

    private fun createNewEllipse(): ShapeDrawable{
        val pathShape = PathShape(Path(),
            CanvasService.extraCanvas.width.toFloat(), CanvasService.extraCanvas.height.toFloat())
        return ShapeDrawable(pathShape)
    }

    fun setStartPoint(startPoint: Point) {
        startingPoint = startPoint
    }

    fun setEndPoint(endPoint: Point) {
        endingPoint = endPoint
        ellipse.width = kotlin.math.abs(endingPoint!!.x - startingPoint!!.x).toInt()
        ellipse.x = ((endingPoint!!.x + startingPoint!!.x) / 2).toInt()
        ellipse.height = kotlin.math.abs(endingPoint!!.y - startingPoint!!.y).toInt()
        ellipse.y = ((endingPoint!!.y + startingPoint!!.y) / 2).toInt()

        DrawingJsonService.updateEllipse(ellipse)

        this.generateBorderPath()
        this.generateFillPath()
    }

    private fun getFillEllipse(): ShapeDrawable{
        return ellipseShape.getDrawable(fillEllipseIndex) as ShapeDrawable
    }

    private fun getBorderEllipse(): ShapeDrawable{
        return ellipseShape.getDrawable(borderEllipseIndex) as ShapeDrawable
    }

    private fun getEllipseDrawable(): LayerDrawable {
        return DrawingObjectManager.getDrawable(this.layerIndex) as LayerDrawable
    }

    override fun update(drawingCommand: Any) {
        if(drawingCommand is EllipseUpdate){
            ellipse.x = drawingCommand.x
            ellipse.y = drawingCommand.y
            ellipse.width = drawingCommand.width
            ellipse.height = drawingCommand.height
            generateFillPath()
            generateBorderPath()
        }
    }

    override fun execute() {
        if(ellipse.stroke != "none"){
            val borderRectPathShape = PathShape(borderPath,
                CanvasService.extraCanvas.width.toFloat(), CanvasService.extraCanvas.height.toFloat()
            )
            var borderRectDrawable = ShapeDrawable(borderRectPathShape)
            this.getBorderEllipse().bounds = this.boundingRectangle

            this.getEllipseDrawable().setDrawable(this.borderEllipseIndex, borderRectDrawable)
            this.getBorderEllipse().paint.set(this.borderPaint)
        }

        if(ellipse.fill != "none"){
            val fillRectPathShape = PathShape(fillPath,
                CanvasService.extraCanvas.width.toFloat(), CanvasService.extraCanvas.height.toFloat()
            )

            var fillRectDrawable = ShapeDrawable(fillRectPathShape)
            this.getFillEllipse().bounds = this.boundingRectangle

            this.getEllipseDrawable().setDrawable(this.fillEllipseIndex, fillRectDrawable)
            this.getFillEllipse().paint.set(this.fillPaint)
        }
        
        this.getEllipseDrawable().bounds = this.boundingRectangle
        DrawingObjectManager.addCommand(ellipse.id, this)
        DrawingObjectManager.setDrawable(layerIndex, ellipseShape)
        CanvasUpdateService.invalidate()
    }

    private fun generateFillPath(){
        var left = ellipse.x - ellipse.width / 2 + ellipse.strokeWidth
        var top = ellipse.y - ellipse.height / 2 + ellipse.strokeWidth
        var right = ellipse.x + ellipse.width / 2 - ellipse.strokeWidth
        var bottom = ellipse.y + ellipse.height / 2 - ellipse.strokeWidth
        var rect = RectF(left.toFloat(), top.toFloat(), right.toFloat(), bottom.toFloat())

        fillPath = Path()
        fillPath.addOval(rect, Path.Direction.CW)
    }

    private fun generateBorderPath(){
        var left = ellipse.x - ellipse.width / 2
        var top = ellipse.y - ellipse.height / 2
        var right = ellipse.x + ellipse.width / 2
        var bottom = ellipse.y + ellipse.height / 2
        var rect = RectF(left.toFloat(), top.toFloat(), right.toFloat(), bottom.toFloat())

        borderPath = Path()

        borderPath.addOval(rect, Path.Direction.CW)
        borderPath.close()

        val innerRect = RectF(rect)
        innerRect.inset(this.ellipse.strokeWidth.toFloat(), this.ellipse.strokeWidth.toFloat())
        if (innerRect.width() > 0 && innerRect.height() > 0) {
            borderPath.addOval(innerRect, Path.Direction.CW)
            borderPath.close()
        }
        borderPath.fillType = Path.FillType.EVEN_ODD
    }
}