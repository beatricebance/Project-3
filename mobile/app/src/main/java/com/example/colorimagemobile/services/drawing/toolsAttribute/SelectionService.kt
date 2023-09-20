package com.example.colorimagemobile.services.drawing.toolsAttribute

import android.graphics.*
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.RectShape
import com.example.colorimagemobile.classes.toolsCommand.EllipseCommand
import com.example.colorimagemobile.classes.toolsCommand.PencilCommand
import com.example.colorimagemobile.classes.toolsCommand.RectangleCommand
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.Point

// Helper to draw selection box to canvas
object SelectionService {
    lateinit var selectedShape: Drawable
    var selectedShapeIndex: Int = -1

    var selectionBox: LayerDrawable = LayerDrawable(arrayOf<Drawable>())
    private lateinit var selectionRectangle: ShapeDrawable
    var selectedDrawable: Drawable? = null
    var selectedAnchorIndex: AnchorIndexes = AnchorIndexes.NONE

    private lateinit var topCtrl: LayerDrawable
    private lateinit var leftCtrl: LayerDrawable
    private lateinit var rightCtrl: LayerDrawable
    private lateinit var bottomCtrl: LayerDrawable
    private lateinit var topLeftCtrl: LayerDrawable
    private lateinit var topRightCtrl: LayerDrawable
    private lateinit var bottomLeftCtrl: LayerDrawable
    private lateinit var bottomRightCtrl: LayerDrawable
    var anchors: HashMap<LayerDrawable, AnchorIndexes> = HashMap()

    private val pointWidth: Int = 5

    private var borderPaint = Paint()
    private var fillPaint = Paint()

    fun isShapeInitialized(): Boolean {
        return ::selectedShape.isInitialized
    }

    fun initSelectionRectangle() {
        var paint = Paint()
        paint.style = Paint.Style.STROKE
        paint.strokeJoin = Paint.Join.MITER
        paint.strokeWidth = 1F
        paint.color = Color.BLACK
        paint.alpha = 255
        var intervals = arrayOf(10F, 10F)
        paint.pathEffect = DashPathEffect(intervals.toFloatArray(), 0F)

        selectionRectangle = ShapeDrawable(RectShape())
        selectionRectangle.paint.set(paint)

        borderPaint.style = Paint.Style.STROKE
        borderPaint.strokeJoin = Paint.Join.MITER
        borderPaint.color = Color.BLACK
        borderPaint.strokeWidth = 1F
        borderPaint.alpha = 255

        fillPaint.style = Paint.Style.FILL
        fillPaint.strokeJoin = Paint.Join.MITER
        fillPaint.color = Color.WHITE
        fillPaint.strokeWidth = 1F
        fillPaint.alpha = 255
    }

    fun setSelectionBounds(left: Int, top: Int, right: Int, bottom: Int, strokeWidth: Int?) {
        if (strokeWidth != null) {
            this.setSelectionBounds(
                (left - strokeWidth / 2),
                (top - strokeWidth / 2),
                (right + strokeWidth / 2),
                (bottom + strokeWidth / 2)
            )
        } else {
            this.setSelectionBounds(left, top, right, bottom)
        }
    }

    private fun setSelectionBounds(left: Int, top: Int, right: Int, bottom: Int) {
        val selectionBounds = Rect()
        selectionBounds.set(left, top, right, bottom)

        selectionRectangle.bounds = selectionBounds
        selectionBox.addLayer(selectionRectangle)

        val width = right - left
        val height = bottom - top
        val horizontalCenter = left + width / 2
        val verticalCenter = top + height / 2

        topCtrl = setResizingPoint(horizontalCenter, top)
        leftCtrl = setResizingPoint(left, verticalCenter)
        rightCtrl = setResizingPoint(right, verticalCenter)
        bottomCtrl = setResizingPoint(horizontalCenter, bottom)
        topLeftCtrl = setResizingPoint(left, top)
        topRightCtrl = setResizingPoint(right, top)
        bottomLeftCtrl = setResizingPoint(left, bottom)
        bottomRightCtrl = setResizingPoint(right, bottom)


        selectionBox.addLayer(topCtrl)
        selectionBox.addLayer(leftCtrl)
        selectionBox.addLayer(rightCtrl)
        selectionBox.addLayer(bottomCtrl)
        selectionBox.addLayer(topLeftCtrl)
        selectionBox.addLayer(topRightCtrl)
        selectionBox.addLayer(bottomLeftCtrl)
        selectionBox.addLayer(bottomRightCtrl)


        anchors[topLeftCtrl] = AnchorIndexes.TOP_LEFT
        anchors[topCtrl] = AnchorIndexes.TOP
        anchors[topRightCtrl] = AnchorIndexes.TOP_RIGHT
        anchors[leftCtrl] = AnchorIndexes.LEFT
        anchors[rightCtrl] = AnchorIndexes.RIGHT
        anchors[bottomLeftCtrl] = AnchorIndexes.BOTTOM_LEFT
        anchors[bottomCtrl] = AnchorIndexes.BOTTOM
        anchors[bottomRightCtrl] = AnchorIndexes.BOTTOM_RIGHT
    }

    private fun setResizingPoint(x: Int, y: Int): LayerDrawable {
        val borderShape = ShapeDrawable(RectShape())
        val fillShape = ShapeDrawable(RectShape())

        borderShape.paint.set(borderPaint)
        fillShape.paint.set(fillPaint)

        borderShape.setBounds(
            x - pointWidth,
            y - pointWidth,
            x + pointWidth,
            y + pointWidth
        )
        fillShape.setBounds(
            x - pointWidth,
            y - pointWidth,
            x + pointWidth,
            y + pointWidth
        )

        val pointShape = LayerDrawable(arrayOf<Drawable>())
        pointShape.addLayer(fillShape)
        pointShape.addLayer(borderShape)
        pointShape.setBounds(
            x - pointWidth,
            y - pointWidth,
            x + pointWidth,
            y + pointWidth)

        return pointShape
    }

    fun getSelectedAnchor(motionTouchEventX: Float, motionTouchEventY: Float): AnchorIndexes {
        for (anchor in anchors.keys) {
            // PathDrawables have bounds equal to the dimensions of the canvas and
            // click will always be inside of them
            // if is inside bounding box
            if (inBounds(motionTouchEventX, motionTouchEventY, anchor.bounds)) {
                return anchors[anchor]!!
            }
        }
        return AnchorIndexes.NONE
    }

    fun setSelectedAnchor(motionTouchEventX: Float, motionTouchEventY: Float) {
        for (anchor in anchors.keys) {
            // PathDrawables have bounds equal to the dimensions of the canvas and
            // click will always be inside of them

            // if is inside bounding box
            if (motionTouchEventX <= anchor.bounds.right &&
                motionTouchEventX >= anchor.bounds.left &&
                motionTouchEventY >= anchor.bounds.top &&
                motionTouchEventY <= anchor.bounds.bottom) {
                    selectedAnchorIndex = if(anchors[anchor] == null) AnchorIndexes.NONE else anchors[anchor]!!
                    return;
            }
        }
        selectedAnchorIndex = AnchorIndexes.NONE
    }

    fun clearSelection() {
        selectionBox = LayerDrawable(arrayOf<Drawable>())
        anchors = HashMap()
        selectedDrawable = null
    }

    fun resetBoundingBox() {
        this.clearSelection()
        val command = DrawingObjectManager.getCommand(selectedShapeIndex)
        var path: Path? = null
        var strokeWidth: Int? = null
        when(command) {
            is PencilCommand -> {
                path = command.path
                strokeWidth = command.pencil.strokeWidth
            }
            is RectangleCommand -> {
                path = command.borderPath
                strokeWidth = null
            }
            is EllipseCommand -> {
                path = command.borderPath
                strokeWidth = null
            }
        }
        if(path != null){
            val boundingBox = getPathBoundingBox(path)
            setSelectionBounds(
                boundingBox.left.toInt(),
                boundingBox.top.toInt(),
                boundingBox.right.toInt(),
                boundingBox.bottom.toInt(),
                strokeWidth
            )
            when(command) {
                is RectangleCommand -> {
                    command.setStartPoint(Point(boundingBox.left, boundingBox.top))
                    command.setEndPoint(Point(boundingBox.right, boundingBox.bottom))
                }
                is EllipseCommand -> {
                    command.setStartPoint(Point(boundingBox.left, boundingBox.top))
                    command.setEndPoint(Point(boundingBox.right, boundingBox.bottom))
                }
            }
        }
    }

    fun inBounds(motionTouchEventX: Float, motionTouchEventY: Float, bounds: Rect): Boolean{
        return motionTouchEventX <= bounds.right &&
                motionTouchEventX >= bounds.left &&
                motionTouchEventY >= bounds.top &&
                motionTouchEventY <= bounds.bottom
    }

    fun resetSelectedAnchor() {
        selectedAnchorIndex = AnchorIndexes.NONE
    }

    fun getBoundsSelection(): Rect{
        val left = (topLeftCtrl.bounds.left + topLeftCtrl.bounds.right) / 2
        val top = (topLeftCtrl.bounds.top + topLeftCtrl.bounds.bottom) / 2
        val right = (bottomRightCtrl.bounds.left + bottomRightCtrl.bounds.right) / 2
        val bottom = (bottomRightCtrl.bounds.top + bottomRightCtrl.bounds.bottom) / 2
        return Rect(left, top, right, bottom)
    }

    fun getPathBoundingBox(path: Path): RectF {
        val rectF = RectF()
        path.computeBounds(rectF, true)
        return rectF
    }
}

enum class AnchorIndexes {
    NONE,
    TOP_LEFT,
    TOP,
    TOP_RIGHT,
    LEFT,
    RIGHT,
    BOTTOM_LEFT,
    BOTTOM,
    BOTTOM_RIGHT
}