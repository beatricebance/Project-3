package com.example.colorimagemobile.bottomsheets

import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.adapter.AvatarRecyclerAdapter
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.services.avatar.AvatarService
import com.example.colorimagemobile.utils.CommonFun
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import kotlinx.android.synthetic.main.fragment_default_avatar_list_bottom_sheet.*

class DefaultAvatarListBottomSheet : BottomSheetDialogFragment() , AvatarRecyclerAdapter.OnItemClickListener{
    private lateinit  var layoutManagerAvatar : RecyclerView.LayoutManager
    private lateinit  var adapterAvatar: RecyclerView.Adapter<AvatarRecyclerAdapter.ViewHolder>
    private lateinit var dialog: BottomSheetDialog

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(
            R.layout.fragment_default_avatar_list_bottom_sheet,
            container,
            false
        )
    }

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        dialog = super.onCreateDialog(savedInstanceState) as BottomSheetDialog
        dialog.behavior.state = BottomSheetBehavior.STATE_EXPANDED
        return dialog
    }

    private fun closeSheet() { dialog.behavior.state = BottomSheetBehavior.STATE_HIDDEN }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        layoutManagerAvatar = GridLayoutManager(context,3)
        recyclerViewAvatar.layoutManager = layoutManagerAvatar
        adapterAvatar = AvatarRecyclerAdapter(this)
        recyclerViewAvatar.adapter = adapterAvatar
    }
    // on avatar select in view set profile avatar
    override fun onItemClick(position: Int) {
        val clickedItem: AvatarModel.AllInfo = AvatarService.getAvatars()[position]
        AvatarService.setCurrentAvatar(clickedItem)
        applyAvatarChoose()
    }

    // Change avatar in view
    fun applyAvatarChoose(){
        val currentAvatar = AvatarService.getCurrentAvatar()
        MyPicasso().loadImage(currentAvatar.imageUrl, CommonFun.imageView)
        closeSheet()
    }

}