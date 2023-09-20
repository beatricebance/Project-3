package com.example.colorimagemobile.classes.tools

import android.content.Context
import androidx.fragment.app.Fragment
import com.example.colorimagemobile.R
import com.example.colorimagemobile.enumerators.ToolType
import com.example.colorimagemobile.interfaces.ITool
import com.example.colorimagemobile.ui.home.fragments.gallery.attributes.selection.SelectionFragment
import com.example.colorimagemobile.ui.home.fragments.gallery.views.CanvasView
import com.example.colorimagemobile.ui.home.fragments.gallery.views.SelectionView

internal class SelectionTool: ITool {
    override fun getTitle(): String {
        return "Selection"
    }

    override fun getType(): ToolType {
        return ToolType.SELECTION
    }

    override fun getIcon(): Int {
        return R.drawable.drawing_icon_selection
    }

    override fun getView(context: Context): CanvasView {
        return SelectionView(context)
    }

    override fun getFragment(): Fragment {
        return SelectionFragment()
    }
}