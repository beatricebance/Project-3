package com.example.colorimagemobile.services.drawing

import com.example.colorimagemobile.classes.xml_json.StringParser
import com.example.colorimagemobile.models.*
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService

object DrawingJsonService {

    private var currentSVGObject: CustomSVG? = null

    fun setSVGObject(svg: CustomSVG) {
        currentSVGObject = svg

        if (currentSVGObject?.polyline.isNullOrEmpty()) currentSVGObject?.polyline = arrayListOf()
        if (currentSVGObject?.rect.isNullOrEmpty()) currentSVGObject?.rect = arrayListOf()
        if (currentSVGObject?.ellipse.isNullOrEmpty()) currentSVGObject?.ellipse = arrayListOf()
    }

    fun getSvgObject(): CustomSVG? {
        return currentSVGObject
    }

    private fun getPolylineExtraStyle(): String = " stroke-linecap: round; stroke-linejoin: round;"

    fun createPolyline(pencilData: PencilData) {
        val style = StringParser.buildStyle(pencilData as ToolData) + getPolylineExtraStyle()
        val initialPoints = "${pencilData.pointsList[0].x} ${pencilData.pointsList[0].y}"

        val polyline = Polyline(id=pencilData.id, name="pencil", points=initialPoints, style=style)
        currentSVGObject?.polyline?.add(polyline)
    }

    fun addPointToPolyline(id: String, point: Point) {
        val polyline = currentSVGObject?.polyline?.find { line -> line.id == id }
        polyline?.points += ", ${point.x} ${point.y}"
    }

    fun createRect(rectangleData: RectangleData) {
        val style = StringParser.buildStyle(rectangleData as ToolData)

        val rect = Rectangle(
            id=rectangleData.id,
            name="rectangle",
            x="${rectangleData.x}px",
            y="${rectangleData.y}px",
            width="${rectangleData.width}px",
            height="${rectangleData.height}px",
            style=style
        )
        currentSVGObject?.rect?.add(rect)
    }

    fun updateRect(rectangleData: RectangleData) {
        val rectangle = currentSVGObject?.rect?.find { rect -> rect.id == rectangleData.id } ?: return

        rectangle.width = "${rectangleData.width}px"
        rectangle.height = "${rectangleData.height}px"
        rectangle.x = "${rectangleData.x}px"
        rectangle.y = "${rectangleData.y}px"
    }

    fun createEllipse(ellipseData: EllipseData) {
        val style = StringParser.buildStyle(ellipseData as ToolData)

        val ellipse = Ellipse(
            id=ellipseData.id,
            name="ellipse",
            rx="${ellipseData.width/2}px",
            ry="${ellipseData.height/2}px",
            width="${ellipseData.width}px",
            height="${ellipseData.height}px",
            cx="0px",
            cy="0px",
            style=style
        )
        currentSVGObject?.ellipse?.add(ellipse)
    }

    fun updateEllipse(ellipseData: EllipseData) {
        val ellipse = currentSVGObject?.ellipse?.find { ellipse -> ellipse.id == ellipseData.id } ?: return

        ellipse.width = "${ellipseData.width}px"
        ellipse.height = "${ellipseData.height}px"
        ellipse.rx = "${(ellipseData.width / 2)}px"
        ellipse.ry = "${(ellipseData.height / 2)}px"
        ellipse.cx = "${ellipseData.x}px"
        ellipse.cy = "${ellipseData.y}px"
    }

    fun removePolyline(id: String) {
        currentSVGObject?.polyline = currentSVGObject?.polyline?.filter { polyline -> polyline.id != id } as ArrayList<Polyline>?
    }

    fun removeRectangle(id: String) {
        currentSVGObject?.rect = currentSVGObject?.rect?.filter { rect -> rect.id != id } as ArrayList<Rectangle>?
    }

    fun removeEllipse(id: String) {
        currentSVGObject?.ellipse = currentSVGObject?.ellipse?.filter { ellipse -> ellipse.id != id } as ArrayList<Ellipse>?
    }

    fun updatePolylineWidth(pencilData: PencilData) {
        val id = DrawingObjectManager.getUuid(SelectionService.selectedShapeIndex)

        val polyline = currentSVGObject?.polyline?.find { polyline -> polyline.id == id }
        polyline?.style = StringParser.buildStyle(pencilData as ToolData) + getPolylineExtraStyle()
    }

    fun updateRectangleWidth(rectangleData: RectangleData) {
        val id = DrawingObjectManager.getUuid(SelectionService.selectedShapeIndex)

        val rect = currentSVGObject?.rect?.find { rect -> rect.id == id }
        rect?.style = StringParser.buildStyle(rectangleData as ToolData)
    }

    fun updateEllipseWidth(ellipseData: EllipseData) {
        val id = DrawingObjectManager.getUuid(SelectionService.selectedShapeIndex)

        val ellipse = currentSVGObject?.ellipse?.find { ellipse -> ellipse.id == id }
        ellipse?.style = StringParser.buildStyle(ellipseData as ToolData)
    }
}