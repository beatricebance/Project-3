package com.example.colorimagemobile.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.services.users.UserService

class UsersMenuRecyclerAdapter(
        val layoutID: Int,
        val openUser: (Int) -> Unit):
    RecyclerView.Adapter<UsersMenuRecyclerAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UsersMenuRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(layoutID, parent, false)
        return ViewHolder(view)
    }
    override fun onBindViewHolder(holder: UsersMenuRecyclerAdapter.ViewHolder, position: Int) {
        holder.username.text = UserService.getAllUserInfo()[position].username
        MyPicasso().loadImage(UserService.getAllUserInfo()[position].avatar.imageUrl, holder.image)

    }

    override fun getItemCount(): Int { return UserService.getAllUserInfo().size }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        var image : ImageView = itemView.findViewById(R.id.card_user_imageview);
        var username : TextView = itemView.findViewById(R.id.card_user_username);

        init {
            itemView.setOnClickListener { openUser(bindingAdapterPosition) }
        }
    }
}