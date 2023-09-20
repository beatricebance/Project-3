package com.example.colorimagemobile.ui.home.fragments.gallery.attributes.colorPalette

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.Button
import android.widget.RelativeLayout
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.google.android.material.button.MaterialButton
import top.defaults.colorpicker.ColorPickerView

class ColorPaletteFragment : Fragment(R.layout.fragment_color_palette) {

    private lateinit var primaryBtn: Button
    private lateinit var secondaryBtn: Button
    private lateinit var swapBtn: MaterialButton
    private lateinit var colorPicker: ColorPickerView
    private lateinit var primaryColorPreview: RelativeLayout
    private lateinit var secondaryColorPreview: RelativeLayout

    private lateinit var currentColor: String

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        initVariables(view)
        updatePreview()
        setListeners()
    }

    private fun initVariables(view: View) {
        colorPicker = view.findViewById(R.id.colorPicker)
        primaryBtn = view.findViewById(R.id.colorPrimaryColor)
        secondaryBtn = view.findViewById(R.id.colorSecondaryColor)
        swapBtn = view.findViewById(R.id.colorSwapColor)
        primaryColorPreview = view.findViewById(R.id.colorPalettePrimaryColor)
        secondaryColorPreview = view.findViewById(R.id.colorPaletteSecondaryColor)

        currentColor = ColorService.getPrimaryColorAsString()
        colorPicker.setInitialColor(ColorService.getPrimaryColorAsInt())
    }

    private fun setListeners() {
        colorPicker.subscribe { color, _, _ ->
            currentColor = ColorService.intToRGBA(color)
        }

        primaryBtn.setOnClickListener {
            ColorService.setPrimaryColor(currentColor)
            updatePreview()
        }

        secondaryBtn.setOnClickListener {
            ColorService.setSecondaryColor(currentColor)
            updatePreview()
        }

        swapBtn.setOnClickListener {
            ColorService.swapColors()
            updatePreview()
        }
    }

    private fun updatePreview() {
        primaryColorPreview.setBackgroundColor(ColorService.getPrimaryColorAsInt())
        secondaryColorPreview.setBackgroundColor(ColorService.getSecondaryColorAsInt())
    }
}