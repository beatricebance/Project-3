package com.example.colorimagemobile.bottomsheets

import android.annotation.SuppressLint
import android.app.Activity
import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import android.widget.TextView
import androidx.core.widget.doOnTextChanged
import com.example.colorimagemobile.R
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.PrivacyLevel
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard
import com.example.colorimagemobile.utils.CommonFun.Companion.onEnterKeyPressed
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import kotlinx.android.synthetic.main.bottomsheet_edit_drawing.*

class EditDrawingBottomSheet(
    private val activity: Activity,
    private val drawing: DrawingModel.Drawing,
    val updateDrawing: (newDrawingInfo: DrawingModel.UpdateDrawing) -> Unit
): BottomSheetDialogFragment() {
    private lateinit var updateBtn: Button
    private lateinit var nameLayout: TextInputLayout
    private lateinit var nameInput: TextInputEditText
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var passwordInput: TextInputEditText
    private lateinit var dialog: BottomSheetDialog
    private lateinit var privacyInput: AutoCompleteTextView
    private val privacyList = arrayListOf<String>(PrivacyLevel.PUBLIC.toString(), PrivacyLevel.PRIVATE.toString(), PrivacyLevel.PROTECTED.toString())

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.bottomsheet_edit_drawing, container, false)
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        dialog = super.onCreateDialog(savedInstanceState) as BottomSheetDialog
        dialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
        return dialog
    }

    private fun closeSheet() { dialog.behavior.state = BottomSheetBehavior.STATE_HIDDEN }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<TextView>(R.id.editDrawingFormTitle).text = "Editing the drawing parameters of ${drawing.name}"

        nameLayout = view.findViewById(R.id.editDrawingNameLayout)
        nameInput = view.findViewById(R.id.editDrawingNameInputText)
        nameInput.setText(drawing.name)

        passwordLayout = view.findViewById(R.id.editProtectedPasswordInputLayout)
        passwordInput = view.findViewById(R.id.editProtectedPasswordInputText)

        privacyInput = view.findViewById(R.id.editDrawingPrivacyAutoCompleteTextView)
        updateBtn = view.findViewById(R.id.updateDrawingBtn)

        setListeners()
        setPrivacyInput()
    }

    private fun setPrivacyInput() {
        val privacyArrayAdapter = ArrayAdapter(requireContext(), R.layout.dropdown_text, privacyList)
        privacyInput.setAdapter(privacyArrayAdapter)
        privacyInput.setText(drawing.privacyLevel, false);

        if (drawing.privacyLevel != PrivacyLevel.PROTECTED.toString()) togglePasswordInput(false)
        if (drawing.privacyLevel == PrivacyLevel.PROTECTED.toString()) passwordInput.setText(drawing.password)
    }

    private fun togglePasswordInput(shouldEnable: Boolean) {
        passwordLayout.alpha = if (shouldEnable) 1f else .4f
        passwordLayout.isClickable = shouldEnable
        passwordLayout.isEnabled = shouldEnable
    }

    private fun isProtected(): Boolean {
        return privacyInput.text.toString() == PrivacyLevel.PROTECTED.toString()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setListeners() {
        passwordInput.doOnTextChanged { text, _, _, _ ->
            passwordLayout.error = if (text.toString().isEmpty()) "Password can't be empty" else null
        }

        nameInput.doOnTextChanged { text, _, _, _ ->
            nameLayout.error = if (text.toString().isEmpty()) "Drawing name can't be empty" else null
        }

        privacyInput.setOnItemClickListener { _, _, _, _ ->
            togglePasswordInput(isProtected())
        }

        editDrawingForm.setOnTouchListener{_, _ -> hideKeyboard(activity, editDrawingForm) }
        updateBtn.setOnClickListener { onUpdate() }
        onEnterKeyPressed(passwordInput) { onUpdate() }
        onEnterKeyPressed(nameInput) { onUpdate() }
    }

    private fun shakeForm() {
        val shake = AnimationUtils.loadAnimation(activity.getApplicationContext(), R.anim.shake)
        editDrawingForm.startAnimation(shake);
    }

    private fun onUpdate() {
        val enteredPassword = passwordInput.text.toString()
        val enteredName = nameInput.text.toString()
        val newPrivacy = privacyInput.text.toString()

        if (enteredName.isNullOrEmpty()) {
            shakeForm()
            return
        }

        val isProtected = newPrivacy == PrivacyLevel.PROTECTED.toString()
        if (isProtected && enteredPassword.isNullOrEmpty()) {
            printToast(activity, "Password can't be empty")
            shakeForm()
            return
        }

        val updateDrawingData = DrawingModel.UpdateDrawing(name=enteredName, privacyLevel=newPrivacy)
        if (isProtected) updateDrawingData.password = enteredPassword

        updateDrawing(updateDrawingData)
        closeSheet()
    }
}