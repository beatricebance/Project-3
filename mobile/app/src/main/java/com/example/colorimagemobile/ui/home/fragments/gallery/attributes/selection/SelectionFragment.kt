package com.example.colorimagemobile.ui.home.fragments.gallery.attributes.selection

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.NumberPicker
import androidx.fragment.app.Fragment
import androidx.lifecycle.LifecycleOwner
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.drawing.toolsAttribute.DeleteService
import com.example.colorimagemobile.services.drawing.toolsAttribute.LineWidthService

class SelectionFragment : Fragment(R.layout.fragment_selection) {
    private lateinit var  deleteShapeBtn: Button
    private lateinit var  widthPicker: NumberPicker

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        deleteShapeBtn = view.findViewById(R.id.deleteShapeBtn)
        widthPicker = view.findViewById(R.id.width_picker)
        setWidthListener()
        setDeleteListener()
    }

    private fun setWidthListener() {
        widthPicker.minValue = LineWidthService.minWidth
        widthPicker.maxValue = LineWidthService.maxWidth

        LineWidthService.getCurrentWidth().observe(context as LifecycleOwner, {
            widthPicker.value = it
        })

        widthPicker.setOnValueChangedListener { _, _, newValue ->
            LineWidthService.changeLineWidth(newValue)
        }
    }

    private fun setDeleteListener() {
        deleteShapeBtn.setOnClickListener {
            DeleteService.deleteSelectedLayer()
        }
    }
}