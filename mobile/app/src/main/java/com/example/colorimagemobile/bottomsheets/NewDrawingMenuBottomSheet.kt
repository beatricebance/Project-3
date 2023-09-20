package com.example.colorimagemobile.bottomsheets

import android.annotation.SuppressLint
import android.app.Dialog
import android.graphics.Color
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.ArrayAdapter
import android.widget.AutoCompleteTextView
import android.widget.Button
import androidx.core.widget.doOnTextChanged
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.LifecycleOwner
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.ImageConvertor
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.classes.xml_json.SVGBuilder
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.TeamModel
import com.example.colorimagemobile.repositories.DrawingRepository
import com.example.colorimagemobile.repositories.UserRepository
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.drawing.toolsAttribute.ColorService
import com.example.colorimagemobile.services.socket.DrawingSocketService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.ui.home.fragments.gallery.GalleryDrawingFragment
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.Constants
import com.example.colorimagemobile.utils.Constants.DRAWING.Companion.MAX_HEIGHT
import com.example.colorimagemobile.utils.Constants.DRAWING.Companion.MAX_WIDTH
import com.example.colorimagemobile.utils.Constants.DRAWING.Companion.MIN_HEIGHT
import com.example.colorimagemobile.utils.Constants.DRAWING.Companion.MIN_WIDTH
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.bottomsheet_create_channel.*
import kotlinx.android.synthetic.main.bottomsheet_drawing_menu.*
import top.defaults.colorpicker.ColorPickerView

class NewDrawingMenuBottomSheet: BottomSheetDialogFragment() {
    private lateinit var createDrawingBtn: Button
    private lateinit var widthLayout: TextInputLayout
    private lateinit var heightLayout: TextInputLayout
    private lateinit var dialog: BottomSheetDialog
    private lateinit var assignToInput: AutoCompleteTextView
    private lateinit var privacyInput: AutoCompleteTextView
    private lateinit var passwordLayout: TextInputLayout

    private val USER_ME = "Me"
    private var drawingName = ""
    private var drawingPassword = ""
    private var widthValue = 0
    private var heightValue = 0
    private var userTeams: List<TeamModel> = arrayListOf()
    private val privacyList = arrayListOf<String>("public", "private", "protected")

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.bottomsheet_drawing_menu, container, false)
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        dialog = super.onCreateDialog(savedInstanceState) as BottomSheetDialog
        dialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
        return dialog
    }

    private fun closeSheet() { dialog.behavior.state = BottomSheetBehavior.STATE_HIDDEN }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        createDrawingBtn = view.findViewById(R.id.createDrawingBtn)
        widthLayout = view.findViewById(R.id.newDrawingWidthInputLayout)
        heightLayout = view.findViewById(R.id.newDrawingHeightInputLayout)
        assignToInput = view.findViewById(R.id.newDrawingOwnerAutoCompleteTextView)
        privacyInput = view.findViewById(R.id.newDrawingPrivacyAutoCompleteTextView)
        passwordLayout = view.findViewById(R.id.newDrawingPasswordLayout)

        fetchTeams()
        setPrivacyInput()
        setListeners(view)
        togglePasswordInput(false)
    }

    private fun fetchTeams() {
        UserRepository().getUserTeams(UserService.getToken(), UserService.getUserInfo()._id).observe(context as LifecycleOwner, {
            if (it.isError as Boolean) { return@observe }
            userTeams = it.data as List<TeamModel>

            val teamNames: ArrayList<String> = arrayListOf()
            teamNames.add(USER_ME)
            userTeams.map { member -> teamNames.add(member.name) }

            val teamArrayAdapter = ArrayAdapter(requireContext(), R.layout.dropdown_text, teamNames)
            assignToInput.setAdapter(teamArrayAdapter)
            assignToInput.setText(teamArrayAdapter.getItem(0).toString(), false);
        })
    }

    private fun setPrivacyInput() {
        val privacyArrayAdapter = ArrayAdapter(requireContext(), R.layout.dropdown_text, privacyList)
        privacyInput.setAdapter(privacyArrayAdapter)
        privacyInput.setText(privacyArrayAdapter.getItem(0).toString(), false);
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setListeners(view: View) {
        var color = "rgba(255, 255, 255, 1)"
        val colorPicker = view.findViewById<ColorPickerView>(R.id.colorPickerNewDrawing)
        colorPicker.setInitialColor(Color.WHITE)

        colorPicker.subscribe { newColor, _, _ -> color = ColorService.intToRGBA(newColor) }
        createNewDrawingForm.setOnTouchListener{_, _ -> hideKeyboard(requireContext(), createNewDrawingForm)}
        view.findViewById<TextInputEditText>(R.id.newDrawingPasswordInputText).doOnTextChanged { text, _, _, _ -> drawingPassword = text.toString() }
        view.findViewById<TextInputEditText>(R.id.newDrawingNameInputText).doOnTextChanged { text, _, _, _ -> drawingName = text.toString() }
        privacyInput.setOnItemClickListener { _, _, _, _ -> togglePasswordInput(isProtected()) }

        // width input validation
        view.findViewById<TextInputEditText>(R.id.newDrawingWidthInputText).doOnTextChanged { text, _, _, _ ->
            widthValue = getCurrentValue(text)
            widthLayout.error = getErrorMessage(widthValue, MIN_WIDTH, MAX_WIDTH)
        }

        // height input validation
        view.findViewById<TextInputEditText>(R.id.newDrawingHeightInputText).doOnTextChanged { text, _, _, _ ->
            heightValue = getCurrentValue(text)
            heightLayout.error = getErrorMessage(heightValue, MIN_HEIGHT, MAX_HEIGHT)
        }

        view.findViewById<Button>(R.id.createDrawingBtn).setOnClickListener {
            if (widthValue == 0 || heightValue == 0 || drawingName == "" || (isProtected() && drawingPassword == "")) {
                val shake = AnimationUtils.loadAnimation(requireActivity().getApplicationContext(), R.anim.shake)
                createNewDrawingForm.startAnimation(shake);
                    return@setOnClickListener
            }

            createDrawing(color)
        }
    }

    private fun isProtected(): Boolean {
        return privacyInput.text.toString() == privacyList[2]
    }

    private fun togglePasswordInput(shouldEnable: Boolean) {
        passwordLayout.alpha = if (shouldEnable) 1f else .4f
        passwordLayout.isClickable = shouldEnable
        passwordLayout.isEnabled = shouldEnable
    }

    // read input field and convert to int
    private fun getCurrentValue(text: CharSequence?): Int {
        val currentText = text!!.toString()
        return if(currentText == "") 0 else currentText.toInt()
    }

    // check input field's value range
    private fun getErrorMessage(currentValue: Int, min: Int, max: Int): String? {
        return if (currentValue < min || currentValue > max) getSizeError(min, max) else null
    }

    // error to show if input is invalid
    private fun getSizeError(min: Int, max: Int): String {
        return "Value must be between ${min}px and ${max}px"
    }

    private fun getOwnerModel(): Pair<String, String> {
        val assignToValue = assignToInput.text.toString()
        val ownerModel = if (assignToValue == USER_ME) "User" else "Team"

        var ownerId = UserService.getUserInfo()._id // me by default

        if (assignToValue != USER_ME) {
            val team = userTeams.find { team -> team.name == assignToValue }
            ownerId = team!!._id
        }

        return Pair(ownerModel, ownerId)
    }

    private fun createDrawing(color: String) {
        // create SVG object
        val svgBuilder = SVGBuilder("svg")
        svgBuilder.addAttr("width", widthValue)
        svgBuilder.addAttr("height", heightValue)
        svgBuilder.addAttr("style", "background-color: $color")

        val base64 = ImageConvertor.XMLToBase64(svgBuilder.getXML())
        val owner = getOwnerModel()
        val privacyLevel = privacyInput.text.toString()
        val password = if (isProtected()) drawingPassword else null
        val newDrawing = DrawingModel.CreateDrawing(_id=null, dataUri=base64, ownerModel=owner.first, owner=owner.second, name=drawingName, privacyLevel=privacyLevel, password=password)

        DrawingRepository().createNewDrawing(newDrawing).observe(context as LifecycleOwner, {
            printToast(requireContext(), it.message!!)
            if (it.isError as Boolean) { return@observe }

            // open drawing
            val drawing = it.data as DrawingModel.Drawing
            if (drawing._id != null) {
                closeSheet()

                DrawingService.setAllDrawings(listOf(drawing))
                DrawingService.setCurrentDrawingID(drawing._id)

                // join room socket
                DrawingSocketService.joinCurrentDrawingRoom()

                val imageConvertor = ImageConvertor(requireContext())
                val svgString = imageConvertor.getSvgAsString(drawing.dataUri)
                DrawingObjectManager.createDrawableObjects(svgString)
                MyFragmentManager(context as FragmentActivity).open(R.id.main_gallery_fragment, GalleryDrawingFragment())
                CanvasUpdateService.invalidate()
            }
        })
    }
}