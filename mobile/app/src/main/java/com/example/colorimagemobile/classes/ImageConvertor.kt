package com.example.colorimagemobile.classes

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.util.Base64
import com.caverock.androidsvg.SVG
import com.example.colorimagemobile.classes.xml_json.SVGParser
import com.example.colorimagemobile.models.BaseSVG
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import java.lang.NullPointerException
import java.nio.charset.StandardCharsets
import kotlin.math.ceil

class ImageConvertor(val context: Context) {

    companion object {
        const val BASE_64_URI = "data:image/svg+xml;base64,"

        fun XMLToBase64(xmlString: String): String {
            return BASE_64_URI + Base64.encodeToString(xmlString.toByteArray(), Base64.NO_WRAP)
        }
    }

    // remove data:image/svg+xml;base64, from URI and decode String
    fun getSvgAsString(dataURI: String): String {
        if (!dataURI.contains(BASE_64_URI)) return dataURI

        val base64Data = dataURI.replace(BASE_64_URI, "");
        val imageBytes = Base64.decode(base64Data, Base64.DEFAULT);
        return String(imageBytes, StandardCharsets.UTF_8)
    }

    // convert a base64 image to Bitmap: https://stackoverflow.com/questions/37327038/svg-data-uri-to-bitmap
    fun renderBase64ToBitmap(dataURI: String): Bitmap? {
        return try {
            val svgAsString = getSvgAsString(dataURI)

            // render to canvas
            val svg: SVG = SVG.getFromString(svgAsString)

            // set width and height to canvas
            val newBitmap = Bitmap.createBitmap(
                ceil(svg.documentWidth.toDouble()).toInt(),
                ceil(svg.documentHeight.toDouble()).toInt(),
                Bitmap.Config.ARGB_8888
            )
            val bitmapCanvas = Canvas(newBitmap)

            // set background color of canvas
            val svgParser = SVGParser(svgAsString, BaseSVG::class.java)
            val svgObject = svgParser.getCustomSVG()
            val backgroundColor = svgParser.getBackgroundColor(svgObject.style)
            bitmapCanvas.drawColor(ColorService.rgbaToInt(backgroundColor))

            svg.renderToCanvas(bitmapCanvas);

            return newBitmap
        } catch (error: NullPointerException) {
            printToast(context, "Error converting Base64 into Bitmap")
            printMsg("Error converting Base64 into Bitmap: $error")
            null
        }
    }
}