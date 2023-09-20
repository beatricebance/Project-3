package com.example.colorimagemobile.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.PopupMenu
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.fragment.app.FragmentActivity
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.bottomsheets.EditDrawingBottomSheet
import com.example.colorimagemobile.bottomsheets.ProtectedDrawingConfirmationBottomSheet
import com.example.colorimagemobile.classes.DateFormatter
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.PrivacyLevel
import com.example.colorimagemobile.models.recyclerAdapters.DrawingMenuData
import com.example.colorimagemobile.models.recyclerAdapters.DrawingMenuViewHolder
import com.example.colorimagemobile.services.drawing.CanvasUpdateService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.DrawingOwnerService
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.socket.DrawingSocketService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.ui.home.fragments.gallery.GalleryDrawingFragment
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import com.example.colorimagemobile.utils.Constants
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.newSingleThreadContext
import kotlinx.coroutines.runBlocking

class DrawingMenuRecyclerAdapter(
    val activity: FragmentActivity,
    drawings: ArrayList<DrawingMenuData>,
    val destination: Int,
    val updateDrawing: (newDrawingInfo: DrawingModel.UpdateDrawing, pos: Int) -> Unit
): RecyclerView.Adapter<DrawingMenuRecyclerAdapter.ViewHolder>() {

    val drawingMenus: ArrayList<DrawingMenuData> = drawings

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DrawingMenuRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout. recycler_drawing_menu, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: DrawingMenuRecyclerAdapter.ViewHolder, position: Int) {
        holder.drawingMenuViewHolder.name.text = drawingMenus[position].drawing.name
        holder.drawingMenuViewHolder.authorName.text = DrawingOwnerService.getUsername(drawingMenus[position].drawing.owner)
        holder.drawingMenuViewHolder.drawingDate.text = DateFormatter.getDate(drawingMenus[position].drawing.createdAt!!)
        holder.drawingMenuViewHolder.image.setImageBitmap(drawingMenus[position].imageBitmap)

        val avatar = DrawingOwnerService.getAvatar(drawingMenus[position].drawing.owner)
        if (avatar != null) {
            holder.drawingMenuViewHolder.authorImageViewParent.visibility = View.VISIBLE
            MyPicasso().loadImage(avatar.imageUrl, holder.drawingMenuViewHolder.authorImageView)
        }

        if (drawingMenus[position].drawing.privacyLevel == PrivacyLevel.PROTECTED.toString())
            holder.drawingMenuViewHolder.lockIconView.visibility = View.VISIBLE

        holder.drawingMenuViewHolder.privacyLevel.text = drawingMenus[position].drawing.privacyLevel

        if (!DrawingService.isOwner(drawingMenus[position].drawing)) {
            holder.drawingMenuViewHolder.popupMenu.visibility = View.GONE
        }
    }

    override fun getItemCount(): Int { return drawingMenus.size }

    private fun openDrawing(position: Int, context: Context) {
        // Set current room to drawing id
        DrawingService.setCurrentDrawingID(drawingMenus[position].drawing._id)

        // fetch drawing svgString from database
        runBlocking{
            val job = launch{
                DrawingSocketService.joinCurrentDrawingRoom()
            }
            job.join()
            DrawingSocketService.sendGetUpdateDrawingRequest(drawingMenus, position, destination)
        }
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val drawingMenuViewHolder: DrawingMenuViewHolder

        init {
            val name = itemView.findViewById<TextView>(R.id.card_drawing_menu_name)
            val authorName = itemView.findViewById<TextView>(R.id.card_drawing_menu_author)
            val drawingDate = itemView.findViewById<TextView>(R.id.card_drawing_menu_date)
            val imageView = itemView.findViewById<ImageView>(R.id.card_drawing_menu_image)
            val lockIconView = itemView.findViewById<ImageView>(R.id.card_drawing_menu_privacy_icon)
            val authorImageView = itemView.findViewById<ImageView>(R.id.card_drawing_menu_author_image)
            val authorImageViewParent = itemView.findViewById<CardView>(R.id.card_drawing_menu_author_image_main)
            val privacyLevel = itemView.findViewById<TextView>(R.id.card_drawing_menu_date_privacy)
            val popupMenu = itemView.findViewById<ImageButton>(R.id.card_drawing_menu_options)

            drawingMenuViewHolder = DrawingMenuViewHolder(name, authorName, drawingDate, imageView, lockIconView, authorImageView, privacyLevel, authorImageViewParent, popupMenu)

            // click listener for clicking on specific drawing
            itemView.setOnClickListener {
                val position: Int = bindingAdapterPosition

                if (drawingMenus[position].drawing.privacyLevel == PrivacyLevel.PROTECTED.toString()) {
                    // show password dialog
                    val passwordConfirmation = ProtectedDrawingConfirmationBottomSheet(activity, drawingMenus[position].drawing.password) { openDrawing(bindingAdapterPosition, itemView.context)}
                    passwordConfirmation.show(activity.supportFragmentManager, "ProtectedDrawingConfirmationBottomSheet")
                    return@setOnClickListener
                }

                openDrawing(bindingAdapterPosition, itemView.context)
            }

            popupMenu.setOnClickListener {
                val optionMenu = PopupMenu(it.context, it!!)
                optionMenu.inflate(R.menu.drawing_popup_menu)
                optionMenu.setOnMenuItemClickListener(PopupMenu.OnMenuItemClickListener { item: MenuItem? ->

                    when (item!!.itemId) {
                        R.id.edit_drawing -> {
                            val updateDrawingBS = EditDrawingBottomSheet(activity, drawingMenus[bindingAdapterPosition].drawing) { updatedDrawing -> updateDrawing(updatedDrawing, bindingAdapterPosition) }
                            updateDrawingBS.show(activity.supportFragmentManager, "EditDrawingBottomSheet")
                        }
                        R.id.delete_drawing -> {
                            printMsg("delete $bindingAdapterPosition")
                        }
                    }

                    true
                })
                optionMenu.show()
            }
        }
    }
}