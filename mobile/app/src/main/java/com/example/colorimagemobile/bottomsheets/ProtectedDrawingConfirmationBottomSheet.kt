package com.example.colorimagemobile.bottomsheets

import android.annotation.SuppressLint
import android.app.Activity
import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Button
import androidx.core.widget.doOnTextChanged
import com.example.colorimagemobile.R
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard
import com.example.colorimagemobile.utils.CommonFun.Companion.onEnterKeyPressed
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import kotlinx.android.synthetic.main.bottomsheet_drawing_protected_confirmation.*

class ProtectedDrawingConfirmationBottomSheet(private val activity: Activity, private val password: String?, val openDrawing: () -> Unit): BottomSheetDialogFragment() {
    private lateinit var confirmBtn: Button
    private lateinit var passwordLayout: TextInputLayout
    private lateinit var passwordInput: TextInputEditText
    private lateinit var dialog: BottomSheetDialog

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.bottomsheet_drawing_protected_confirmation, container, false)
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        dialog = super.onCreateDialog(savedInstanceState) as BottomSheetDialog
        dialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
        return dialog
    }

    private fun closeSheet() { dialog.behavior.state = BottomSheetBehavior.STATE_HIDDEN }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        passwordLayout = view.findViewById(R.id.confirmProtectedPasswordInputLayout)
        passwordInput = view.findViewById(R.id.confirmProtectedPasswordInputText)

        confirmBtn = view.findViewById(R.id.confirmProtectedPasswordBtn)

        setListeners()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setListeners() {
        passwordInput.doOnTextChanged { text, _, _, _ ->
            passwordLayout.error = if (text.toString().isEmpty()) "Password can't be empty" else null
        }

        confirmPasswordForm.setOnTouchListener{_, _ -> hideKeyboard(activity, confirmPasswordForm) }
        confirmBtn.setOnClickListener { onConfirmation() }
        onEnterKeyPressed(passwordInput) { onConfirmation() }
    }

    private fun onConfirmation() {
        val enteredPassword = passwordInput.text.toString()
        if (enteredPassword.isNullOrEmpty()) {
            val shake = AnimationUtils.loadAnimation(activity.getApplicationContext(), R.anim.shake)
            confirmPasswordForm.startAnimation(shake);
            return
        }

        if (enteredPassword == password) {
            closeSheet()
            openDrawing()
        } else {
            printToast(activity, "Wrong password!")
        }
    }
}