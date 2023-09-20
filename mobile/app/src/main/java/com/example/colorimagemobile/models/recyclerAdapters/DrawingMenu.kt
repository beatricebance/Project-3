package com.example.colorimagemobile.models.recyclerAdapters

import android.graphics.Bitmap
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.cardview.widget.CardView
import com.example.colorimagemobile.models.DrawingModel

/* holds data of drawing displayed in Gallery */

// our data to display
data class DrawingMenuData(val drawing: DrawingModel.Drawing, val imageBitmap: Bitmap, var svgString: String)

// the layout elements in which we assign our data
data class DrawingMenuViewHolder(
    val name: TextView,
    val authorName: TextView,
    val drawingDate: TextView,
    val image: ImageView,
    val lockIconView: ImageView,
    val authorImageView: ImageView,
    val privacyLevel: TextView,
    val authorImageViewParent: CardView,
    val popupMenu: ImageButton
)
