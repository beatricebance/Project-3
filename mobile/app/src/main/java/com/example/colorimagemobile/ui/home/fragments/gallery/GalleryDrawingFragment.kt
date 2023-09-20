package com.example.colorimagemobile.ui.home.fragments.gallery

import android.graphics.Color
import android.graphics.drawable.ShapeDrawable
import android.os.Bundle
import android.text.Spannable
import android.text.SpannableString
import android.text.style.ImageSpan
import android.transition.AutoTransition
import android.transition.TransitionManager
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.marginLeft
import androidx.core.view.marginTop
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.adapter.ToolsButtonRecyclerAdapter
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.classes.tools.ToolsFactory
import com.example.colorimagemobile.enumerators.ToolType
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.OwnerModel
import com.example.colorimagemobile.repositories.DrawingRepository
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.drawing.ToolTypeService
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService
import com.example.colorimagemobile.services.socket.DrawingSocketService
import com.example.colorimagemobile.services.socket.SocketManagerService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.Constants

class GalleryDrawingFragment : Fragment(R.layout.fragment_gallery_drawing) {
    private lateinit var galleryDrawingFragment: ConstraintLayout;
    private lateinit var panelView: CardView
    private lateinit var toolsFactory: ToolsFactory
    private var roomName: String? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        galleryDrawingFragment = view.findViewById(R.id.galleryDrawingFragment)
        panelView = galleryDrawingFragment.findViewById<CardView>(R.id.canvas_tools_attributes_cardview)
        toolsFactory = ToolsFactory()

        MyFragmentManager(requireActivity()).showBackButton()
        setCurrentRoomName()
        addToolsOnSidebar()
        setToolsListener()
        checkMuseumOwner()
    }

    private fun setCurrentRoomName() {
        roomName = DrawingService.getCurrentDrawingID()

        // go to gallery menu
        if (roomName == null) {
            MyFragmentManager(requireActivity()).open(R.id.main_gallery_fragment, GalleryMenuFragment())
            return
        }
    }

    private fun connectToSocket() {
        if (DrawingService.getCurrentDrawingID() != null) {
            DrawingSocketService.connect()
            DrawingSocketService.setFragmentActivity(requireActivity())

            val socketInformation =
                Constants.SocketRoomInformation(UserService.getUserInfo()._id, roomName!!)
            DrawingSocketService.joinRoom(socketInformation)
        }
    }

    private fun leaveDrawingRoom() {
        if (roomName == null) return
        SocketManagerService.leaveDrawingRoom()
    }

    override fun onPause() {
        super.onPause()
        this.leaveDrawingRoom()
    }

    override fun onStop(){
        super.onStop()
        this.leaveDrawingRoom()
    }

    override fun onDestroy() {
        super.onDestroy()
        this.leaveDrawingRoom()
    }

    private fun checkMuseumOwner() {
        val currentDrawing = DrawingService.getDrawingById()

        // we are the only user/owner of drawing ==> owner is us
        if (currentDrawing.ownerModel == OwnerModel.USER.toString()) {
            if (currentDrawing.owner._id == UserService.getUserInfo()._id) {
                addMuseumButton()
            }
            return
        }

        // drawing belongs to a group ==> owner is teamId
        if (currentDrawing.ownerModel == OwnerModel.TEAM.toString()) {
            if (DrawingService.checkIfUserIsInTeam(currentDrawing.owner._id) != null) addMuseumButton()
        }
    }

    private fun addMuseumButton() {
        val museumButton = createSideButton(R.drawable.ic_museum)

        museumButton.setOnClickListener {
            val drawing = DrawingService.getDrawingById()
            DrawingRepository().publishDrawing(drawing).observe(viewLifecycleOwner, { printToast(requireContext(), it.message!!) })
        }
    }

    private fun createSideButton(icon: Int): Button {
        val toolBtn = Button(context)

        val layoutParams = LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT)
        layoutParams.setMargins(10, 8, 10, 8)
        toolBtn.layoutParams = layoutParams
        toolBtn.setBackgroundColor(Color.rgb(245, 245, 245))

        // center button
        toolBtn.text = SpannableString(" ").apply {
            setSpan(ImageSpan(requireContext(), icon),0,1, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE)
        }

        val toolSidebar = galleryDrawingFragment.findViewById<LinearLayout>(R.id.canvas_tools)
        toolSidebar.addView(toolBtn)

        return toolBtn
    }

    // dynamically add tools on sidebar
    private fun addToolsOnSidebar() {
        val recyclerView = galleryDrawingFragment.findViewById<RecyclerView>(R.id.drawingToolsRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = ToolsButtonRecyclerAdapter(requireContext(), ToolTypeService.getAllToolTypes()) { pos -> onToolClicked(pos)}
    }

    private fun onToolClicked(position: Int) {
        val toolType = ToolTypeService.getAllToolTypes()[position]
        val tool = toolsFactory.getTool(toolType)

        togglePanel(tool.getType())
        MyFragmentManager(requireActivity()).open(R.id.tool_attribute_fragment, tool.getFragment())
        panelView.findViewById<TextView>(R.id.tool_name).text = tool.getTitle()
    }

    // update tool when changed tool
    private fun setToolsListener() {
        ToolTypeService.getCurrentToolType().observe(viewLifecycleOwner, { toolType ->
            val toolView = toolsFactory.getTool(toolType).getView(requireContext())

            if (toolView != null) {
                deselectOnToolChange(toolType)
                val canvasLayout = galleryDrawingFragment.findViewById<RelativeLayout>(R.id.canvas_view)
                canvasLayout.removeAllViews()
                canvasLayout.addView(toolView)
            }
        })
    }

    // if has selection and changes tools, deselect
    private fun deselectOnToolChange(toolType: ToolType) {
        if (SelectionService.selectedShapeIndex != -1 && toolType != ToolType.SELECTION) {
            SelectionService.clearSelection()
            SelectionService.selectedShapeIndex = -1
            SelectionService.selectedShape = ShapeDrawable()
        }
    }

    // open/close side attributes panel
    private fun togglePanel(toolType: ToolType) {
        val currentToolType = ToolTypeService.getCurrentToolType().value

        // close panel because toggling on same tool
        if (currentToolType == toolType && panelView.visibility == View.VISIBLE) {
            TransitionManager.beginDelayedTransition(panelView, AutoTransition())
            panelView.visibility = View.GONE
            return
        }

        // new tool clicked -> open panel
        ToolTypeService.setCurrentToolType(toolType)
        TransitionManager.beginDelayedTransition(panelView, AutoTransition())
        panelView.visibility = View.VISIBLE
    }
}