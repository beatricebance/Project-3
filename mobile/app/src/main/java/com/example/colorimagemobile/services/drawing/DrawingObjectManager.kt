package com.example.colorimagemobile.services.drawing

import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import com.example.colorimagemobile.classes.ImageConvertor
import com.example.colorimagemobile.classes.openDrawingCommand.CreateEllipseCommand
import com.example.colorimagemobile.classes.openDrawingCommand.CreatePolylineCommand
import com.example.colorimagemobile.classes.openDrawingCommand.CreateRectangleCommand
import com.example.colorimagemobile.classes.xml_json.SVGBuilder
import com.example.colorimagemobile.classes.xml_json.SVGParser
import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.CustomSVG
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.github.underscore.lodash.U

object DrawingObjectManager {
    private var layerDrawable: LayerDrawable = LayerDrawable(arrayOf<Drawable>())
    private var commandList: HashMap<String,ICommand> = HashMap()
    private var layerIdUuidMap: HashMap<Int, String> = HashMap()

    var numberOfLayers: Int = 0
        get() = layerDrawable.numberOfLayers


    fun draw(canvas: Canvas){
        layerDrawable.draw(canvas)
    }

    fun setDrawable(layerIndex:Int, drawable:Drawable){
        layerDrawable.setDrawable(layerIndex, drawable)
    }

    fun addLayer(drawable: Drawable, uuid: String): Int{
        var layerId = layerDrawable.addLayer(drawable)
        layerIdUuidMap[layerId] = uuid
        return layerId
    }

    fun getDrawable(layerIndex: Int): Drawable{
        return layerDrawable.getDrawable(layerIndex)
    }

    fun getLayerIndex(uuid: String): Int {
        return layerIdUuidMap.filterValues { it == uuid }.keys.first()
    }

    fun getUuid(layerIndex: Int): String? {
        return layerIdUuidMap[layerIndex]
    }

    fun addCommand(uuid:String, command: ICommand){
        commandList[uuid] =  command
    }

    fun getCommand(uuid: String): ICommand?{
        return commandList[uuid]
    }

    fun getCommand(layerIndex: Int): ICommand? {
        return commandList[layerIdUuidMap[layerIndex]]
    }

    fun removeCommand(layerIndex: Int) {
        commandList.remove(layerIdUuidMap[layerIndex])
    }

    fun clearLayers() {
        layerDrawable = LayerDrawable(arrayOf<Drawable>())
        commandList.clear()
        layerIdUuidMap.clear()
    }

    fun createDrawableObjects(base64: String) {
        CanvasService.createNewBitmap()

        // 1. init svg
        val svgParser = SVGParser(base64, CustomSVG::class.java)
        val svgObject = svgParser.getCustomSVG()

        // 2. init canvas properties and create it
        CanvasService.setWidth(svgObject.width.toInt())
        CanvasService.setHeight(svgObject.height.toInt())

        CanvasService.createNewBitmap()
        val backgroundColor = svgParser.getBackgroundColor(svgObject.style)
        CanvasService.updateCanvasColor(ColorService.rgbaToInt(backgroundColor))

        // 3. Create layerObjects
        val createPolylineCommand = CreatePolylineCommand(svgObject.polyline)
        createPolylineCommand.execute()

        val createRectangleCommand = CreateRectangleCommand(svgObject.rect)
        createRectangleCommand.execute()

        val createEllipseCommand = CreateEllipseCommand(svgObject.ellipse)
        createEllipseCommand.execute()

        // 4. store our "json" object containing every shapes
        DrawingJsonService.setSVGObject(svgObject)
    }

    // converts drawables to svg/xml and then converts to base64
    fun getDrawingDataURI(): String {
        val svgObject = DrawingJsonService.getSvgObject()!!

        // svg attribute
        val rootSVG = SVGBuilder("svg")
        rootSVG.addAttr("width", svgObject.width)
        rootSVG.addAttr("height", svgObject.height)
        rootSVG.addAttr("style", svgObject.style)

        // create svg-xml objects based on shapes and attributes
        if (!svgObject.polyline.isNullOrEmpty()) {
            val polylineArrayBuilder = U.arrayBuilder()
            svgObject.polyline?.forEach { pencil ->
                if (pencil.id == null || pencil.id == "") return@forEach
                polylineArrayBuilder.add(U.objectBuilder()
                    .add("-id", pencil.id)
                    .add("-name", pencil.name)
                    .add("-points", pencil.points)
                    .add("-style", pencil.style))
            }

            rootSVG.addArrayAttr("polyline", polylineArrayBuilder)
        }

        if (!svgObject.rect.isNullOrEmpty()) {
            val rectArrayBuilder = U.arrayBuilder()
            svgObject.rect?.forEach { rect ->
                if (rect.id == null || rect.id == "") return@forEach
                rectArrayBuilder.add(U.objectBuilder()
                    .add("-id", rect.id)
                    .add("-name", rect.name)
                    .add("-x", rect.x)
                    .add("-y", rect.y)
                    .add("-width", rect.width)
                    .add("-height", rect.height)
                    .add("-style", rect.style))
            }
            rootSVG.addArrayAttr("rect", rectArrayBuilder)
        }

        if (!svgObject.ellipse.isNullOrEmpty()) {
            val ellipseArrayBuilder = U.arrayBuilder()
            svgObject.ellipse?.forEach { ellipse ->
                if (ellipse.id == null || ellipse.id == "") return@forEach
                ellipseArrayBuilder.add(U.objectBuilder()
                    .add("-id", ellipse.id)
                    .add("-name", ellipse.name)
                    .add("-cx", ellipse.cx)
                    .add("-cy", ellipse.cy)
                    .add("-rx", ellipse.rx)
                    .add("-ry", ellipse.ry)
                    .add("-width", ellipse.width)
                    .add("-height", ellipse.height)
                    .add("-style", ellipse.style))
            }
            rootSVG.addArrayAttr("ellipse", ellipseArrayBuilder)
        }

        return ImageConvertor.XMLToBase64(rootSVG.getXML())
    }
}