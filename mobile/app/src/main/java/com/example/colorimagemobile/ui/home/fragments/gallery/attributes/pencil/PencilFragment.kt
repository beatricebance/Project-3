package com.example.colorimagemobile.ui.home.fragments.gallery.attributes.pencil

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.NumberPicker
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.drawing.toolsAttribute.PencilService

class PencilFragment : Fragment(R.layout.fragment_pencil) {

    private lateinit var widthPicker: NumberPicker

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        widthPicker = view.findViewById(R.id.pencil_width_picker)
        widthPicker.minValue = PencilService.minWidth
        widthPicker.maxValue = PencilService.maxWidth
        widthPicker.value = PencilService.currentWidth

        widthPicker.setOnValueChangedListener { numberPicker, oldValue, newValue ->
            PencilService.currentWidth = newValue
        }
    }
}