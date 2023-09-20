package com.example.colorimagemobile.ui.home.fragments.gallery.attributes.rectangle

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.NumberPicker
import android.widget.RadioGroup
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.drawing.toolsAttribute.EllipseService
import com.example.colorimagemobile.services.drawing.toolsAttribute.EllipseStyle
import com.example.colorimagemobile.services.drawing.toolsAttribute.RectangleService
import com.example.colorimagemobile.services.drawing.toolsAttribute.RectangleStyle

class RectangleFragment : Fragment() {
    private lateinit var borderWidthPicker: NumberPicker
    private lateinit var radioGroup: RadioGroup

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.fragment_rectangle, container, false)
        onRectRadioListener(view)
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setBorderWidthPicker(view)
    }

    private fun setBorderWidthPicker(view: View) {
        borderWidthPicker = view.findViewById(R.id.rec_border_width_picker)
        borderWidthPicker.minValue = RectangleService.minWidth
        borderWidthPicker.maxValue = RectangleService.maxWidth
        borderWidthPicker.value = RectangleService.currentWidth

        // set border width
        borderWidthPicker.setOnValueChangedListener { _, _, newValue ->
            RectangleService.currentWidth = newValue
        }
    }

    private fun onRectRadioListener(view: View) {
        this.radioGroup = view.findViewById(R.id.rectangle_radioGroup)
        val radioButton = when(RectangleService.getBorderStyle()){
            RectangleStyle.WITH_BORDER_FILL ->R.id.rect_border_fill
            RectangleStyle.NO_BORDER -> R.id.rect_no_border
            RectangleStyle.ONLY_BORDER -> R.id.rect_only_border
        }
        this.radioGroup.check(radioButton)

        // apply border style
        radioGroup.setOnCheckedChangeListener { _, checkedId -> // checkedId is the RadioButton selected
            val borderStyle = when (checkedId) {
                R.id.rect_border_fill -> RectangleStyle.WITH_BORDER_FILL
                R.id.rect_no_border -> RectangleStyle.NO_BORDER
                R.id.rect_only_border -> RectangleStyle.ONLY_BORDER
                else -> RectangleStyle.WITH_BORDER_FILL
            }

            RectangleService.updateBorderStyle(borderStyle)
        }
    }
}