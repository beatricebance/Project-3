package com.example.colorimagemobile.services.drawing

import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path

data class Point(val x: Float, val y: Float)

// contains paint customizations and path's points
data class PaintPath(val id: String, val brush: CustomPaint, val path: Path, val points: ArrayList<Point>)

// Paint/brush customizations
class CustomPaint() {
    private var paint: Paint = Paint()

    init {
        setDefaultBrushAttributes()
    }

    private fun setDefaultBrushAttributes() {
        paint.isAntiAlias = true
        paint.isDither = true
        paint.style = Paint.Style.STROKE
        paint.strokeJoin = Paint.Join.ROUND
        paint.strokeCap = Paint.Cap.ROUND
    }

    fun setColor(newColor: Int) {
        paint.color = newColor
    }

    fun setStrokeWidth(newWidth: Float) {
        paint.strokeWidth = newWidth
    }

    fun getPaint(): Paint {
        return paint
    }
}

// global path and paint holder
object PathService {
    private var paintPath: ArrayList<PaintPath> = arrayListOf()

    fun addPaintPath(newPaintPath: PaintPath) {
        paintPath.add(newPaintPath)
    }

    fun getPaintPath(): ArrayList<PaintPath> {
        return paintPath
    }

    fun removeByID(id: String) {
        paintPath = paintPath.filterIndexed { _, paintPath -> paintPath.id != id  } as ArrayList<PaintPath>
    }
}