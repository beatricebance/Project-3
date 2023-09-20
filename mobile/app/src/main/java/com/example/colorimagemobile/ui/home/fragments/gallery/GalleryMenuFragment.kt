package com.example.colorimagemobile.ui.home.fragments.gallery

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import androidx.constraintlayout.widget.ConstraintLayout
import com.example.colorimagemobile.R
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.repositories.DrawingRepository
import com.example.colorimagemobile.services.SharedPreferencesService
import com.example.colorimagemobile.utils.Constants
import java.util.*
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.adapter.DrawingMenuRecyclerAdapter
import com.example.colorimagemobile.bottomsheets.NewDrawingMenuBottomSheet
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.models.recyclerAdapters.DrawingMenuData
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import kotlin.collections.ArrayList

class GalleryMenuFragment : Fragment(R.layout.fragment_gallery_menu) {
    private lateinit var drawingRepo: DrawingRepository
    private lateinit var sharedPreferencesService: SharedPreferencesService
    private lateinit var drawings: ArrayList<DrawingModel.Drawing>
    private lateinit var galleryView: ConstraintLayout
    private lateinit var drawingsMenu: ArrayList<DrawingMenuData>
    private lateinit var recyclerView: RecyclerView

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        drawingRepo = DrawingRepository()
        sharedPreferencesService = context?.let { SharedPreferencesService(it) }!!
        galleryView = view.findViewById(R.id.galleryMenuView)
        drawings = arrayListOf()

        MyFragmentManager(requireActivity()).hideBackButton()
        DrawingService.setCurrentDrawingID(null)
        setListeners()
        getAllDrawings()
    }

    private fun setListeners() {
        val createDrawingBtn: Button = galleryView.findViewById(R.id.newDrawingBtn)
        createDrawingBtn.setOnClickListener {
            val newDrawingMenu = NewDrawingMenuBottomSheet()
            newDrawingMenu.show(parentFragmentManager, "NewDrawingBottomSheetDialog")
        }
    }

    private fun getAllDrawings() {
        val token = sharedPreferencesService.getItem(Constants.STORAGE_KEY.TOKEN)
        galleryView.findViewById<TextView>(R.id.loadingDrawingsText).visibility = View.VISIBLE

        drawingRepo.getAllDrawings(token).observe(viewLifecycleOwner, {
            // some error occurred during HTTP request
            if (it.isError as Boolean) {
                return@observe
            }

            drawings = DrawingService.filterDrawingsByPrivacy(it.data as ArrayList<DrawingModel.Drawing>)
            DrawingService.setAllDrawings(drawings)
            galleryView.findViewById<TextView>(R.id.loadingDrawingsText).visibility = View.GONE
            renderDrawings()
        })
    }

    // display all existing drawings in menu
    private fun renderDrawings() {
        recyclerView = galleryView.findViewById<RecyclerView>(R.id.drawingMenuRecyclerView)
        drawingsMenu = DrawingService.getDrawingsBitmap(requireContext(), drawings)
        recyclerView.layoutManager = GridLayoutManager(requireContext(), Constants.NB_DATA_ROWS)
        recyclerView.adapter = DrawingMenuRecyclerAdapter(requireActivity(), drawingsMenu, R.id.main_gallery_fragment) { updatedDrawing, pos -> updateDrawing(updatedDrawing, pos) }
    }

    private fun updateDrawing(updatedDrawing: DrawingModel.UpdateDrawing, position: Int) {
        drawingRepo.updateDrawing(drawingsMenu[position].drawing._id!!, updatedDrawing).observe(viewLifecycleOwner, {
            if (it.isError as Boolean) {
                printToast(requireActivity(), it.message!!)
                return@observe
            }

            drawingsMenu[position] = DrawingService.updateDrawingFromMenu(drawingsMenu[position], updatedDrawing)
            recyclerView.adapter?.notifyItemChanged(position)
        })
    }
}