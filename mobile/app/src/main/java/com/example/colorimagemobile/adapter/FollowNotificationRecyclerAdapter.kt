package com.example.colorimagemobile.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R

class FollowNotificationRecyclerAdapter : RecyclerView.Adapter<FollowNotificationRecyclerAdapter.ViewHolder>() {

    private  var userName : MutableList<String> = mutableListOf("boba","bobo")

    override fun onBindViewHolder(holder: FollowNotificationRecyclerAdapter.ViewHolder, position: Int) {

        holder.userName.text = userName[position]
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        var userName : TextView;

        init {
            userName = itemView.findViewById<TextView>(R.id.displayNameText)

        }
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): FollowNotificationRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.fragment_follow_list,parent,false)
        return ViewHolder(view)
    }

    override fun getItemCount(): Int {
        return userName.size
    }
}