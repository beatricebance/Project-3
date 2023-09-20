package com.example.colorimagemobile.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.FragmentActivity
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.models.TextChannelModel
import com.example.colorimagemobile.services.chat.ChatService
import com.example.colorimagemobile.services.chat.TextChannelService

class ChannelsRecyclerAdapter():
    RecyclerView.Adapter<ChannelsRecyclerAdapter.ViewHolder>() {

    private var isAllChannels = true
    private var currentPosition: Int = -1
    private lateinit var channels: ArrayList<TextChannelModel.AllInfo>

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChannelsRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.recycler_chat_channels, parent,false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChannelsRecyclerAdapter.ViewHolder, position: Int) {
        holder.chanelName.text = channels[position].name

        val backgroundColor = if (position == currentPosition) "#f5f5f5" else "#ffffff"
        holder.chanelName.setBackgroundColor(Color.parseColor(backgroundColor))
    }

    override fun getItemCount(): Int {
       return channels.size
    }

    fun setData(newChannels: ArrayList<TextChannelModel.AllInfo>) {
        channels = newChannels
        notifyDataSetChanged()
    }

    fun setIsAllChannels(isAll: Boolean) {
        this.isAllChannels = isAll
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
         var chanelName : TextView = itemView.findViewById<TextView>(R.id.channel_name);

        init {
            itemView.setOnClickListener {
                currentPosition = bindingAdapterPosition

                TextChannelService.setCurrentChannelByPosition(currentPosition, isAllChannels)
                TextChannelService.refreshChannelList()
                ChatService.refreshChatBox(itemView.context as FragmentActivity)
            }
        }
    }
}