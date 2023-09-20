package com.example.colorimagemobile.ui.home.fragments.gallery

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.socket.DrawingSocketService

class GalleryFragment : Fragment(R.layout.fragment_gallery) {
    private val mainGalleryFragmentID = R.id.main_gallery_fragment

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val fragmentDestination = if (DrawingService.getCurrentDrawingID() == null) GalleryMenuFragment() else GalleryDrawingFragment()
        MyFragmentManager(requireActivity()).open(mainGalleryFragmentID, fragmentDestination)
        DrawingSocketService.setFragmentActivity(requireActivity())
    }
}