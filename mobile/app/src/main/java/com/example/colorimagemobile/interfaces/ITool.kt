package com.example.colorimagemobile.interfaces

import android.content.Context
import androidx.fragment.app.Fragment
import com.example.colorimagemobile.enumerators.ToolType
import com.example.colorimagemobile.ui.home.fragments.gallery.views.CanvasView

interface ITool {
    fun getTitle(): String
    fun getType(): ToolType
    fun getIcon(): Int
    fun getView(context: Context): CanvasView?
    fun getFragment(): Fragment
}