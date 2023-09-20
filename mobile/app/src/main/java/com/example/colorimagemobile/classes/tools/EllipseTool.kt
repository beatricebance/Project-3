package com.example.colorimagemobile.classes.tools

import android.content.Context
import androidx.fragment.app.Fragment
import com.example.colorimagemobile.R
import com.example.colorimagemobile.enumerators.ToolType
import com.example.colorimagemobile.interfaces.ITool
import com.example.colorimagemobile.ui.home.fragments.gallery.attributes.ellipse.EllipseFragment
import com.example.colorimagemobile.ui.home.fragments.gallery.views.CanvasView
import com.example.colorimagemobile.ui.home.fragments.gallery.views.EllipseView


class EllipseTool: ITool {
    override fun getTitle(): String {
        return "Ellipse"
    }

    override fun getType(): ToolType {
        return ToolType.ELLIPSE
    }

    override fun getIcon(): Int {
        return R.drawable.drawing_icon_ellipse
    }

    override fun getView(context: Context): CanvasView {
        return EllipseView(context)
    }

    override fun getFragment(): Fragment {
        return EllipseFragment()
    }
}