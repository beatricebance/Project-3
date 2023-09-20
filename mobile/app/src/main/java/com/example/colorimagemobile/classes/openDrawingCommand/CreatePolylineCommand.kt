package com.example.colorimagemobile.classes.openDrawingCommand

import com.example.colorimagemobile.classes.CommandFactory
import com.example.colorimagemobile.classes.toolsCommand.PencilCommand
import com.example.colorimagemobile.classes.xml_json.StringParser
import com.example.colorimagemobile.models.PencilData
import com.example.colorimagemobile.models.Polyline
import com.example.colorimagemobile.models.SvgStyle
import com.example.colorimagemobile.services.drawing.Point
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService

class CreatePolylineCommand(polyLines: ArrayList<Polyline>?): ICreateDrawingCommand {

    private val polyLines = polyLines

    override fun createData(style: SvgStyle): PencilData {
        val color = if (style.stroke.contains("rgba")) style.stroke else ColorService.addAlphaToRGBA(style.stroke, style.strokeOpacity)

        return PencilData(
            id = "",
            fill = "none",
            stroke = color,
            fillOpacity = "none",
            strokeOpacity = "none",
            strokeWidth = style.strokeWidth,
            pointsList = arrayListOf(),
        )
    }

    override fun execute() {
        if (polyLines?.size == 0) return

        polyLines?.forEach { pencil ->

            // found pencil filled with null attributes, so just a check
            if (pencil.id.isNullOrEmpty()) return@forEach

            // get styles
            val style = StringParser.getStyles(pencil.style)
            val pencilData = createData(style)
            pencilData.id = pencil.id

            // points: "1 9, 10 20" -> [1 9, 10 20]
            val points = pencil.points.split(",")

            // for setStartingPoint
            val firstPoint = points[0].split(" ")
            pencilData.pointsList.add(Point(firstPoint[0].toFloat(), firstPoint[1].toFloat()))

            // create Pencil command to draw pencil lines
            val command = CommandFactory.createCommand("Pencil", pencilData) as PencilCommand
            command.execute()

            // draw remaining points
            points.forEach { point ->
                val splicedPoint = point.trimStart().split(" ")
                //val splicedPoint = point.split(" ").filter { x -> x != "" }
                command.addPoint(splicedPoint[0].toFloat(), splicedPoint[1].toFloat())
                command.execute()
            }
        }
    }
}