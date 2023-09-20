package com.example.colorimagemobile.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.models.ChatSocketModel
import com.example.colorimagemobile.services.users.UserService

class ChatMessageRecyclerAdapter(): RecyclerView.Adapter<ChatMessageRecyclerAdapter.ViewHolder>() {
    private val PUBLIC_MESSAGE = 0
    private val MY_MESSAGE = 1

    private lateinit var chatMessages: MutableSet<ChatSocketModel>

    // creates card view referencing to individual cards
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatMessageRecyclerAdapter.ViewHolder {
        return if (viewType === MY_MESSAGE) {
            val view: View = LayoutInflater.from(parent.context)
                .inflate(R.layout.card_own_chat, parent, false)
            ViewHolder(view)
        } else {
            val view: View = LayoutInflater.from(parent.context)
                .inflate(R.layout.card_other_chat, parent, false)
            ViewHolder(view)
        }
    }

    // populate our data to card view - iterates over getItemCount() ?
    override fun onBindViewHolder(holder: ChatMessageRecyclerAdapter.ViewHolder, position: Int) {
        holder.author.text = chatMessages.elementAt(position).author
        holder.message.text = chatMessages.elementAt(position).message
        holder.timestamp.text = chatMessages.elementAt(position).timestamp
    }

    // how many items we pass to our view holder
    override fun getItemCount(): Int {
        return chatMessages.size
    }

    // update all messages
    fun setChat(chat: MutableSet<ChatSocketModel>) {
        chatMessages = chat
        notifyDataSetChanged()
    }

    // add only one message
    fun addChatItem(message: ChatSocketModel) {
        chatMessages.add(message)
        notifyItemChanged(chatMessages.size - 1)
    }

    // calculate whose chat it is
    override fun getItemViewType(position: Int): Int {
        val currentUser = UserService.getUserInfo().username
        return if (chatMessages.elementAt(position).author == currentUser) {
            MY_MESSAGE
        } else {
            PUBLIC_MESSAGE
        }
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        var author: TextView
        var message: TextView
        var timestamp: TextView

        init {
            author = itemView.findViewById(R.id.author)
            message = itemView.findViewById(R.id.message)
            timestamp = itemView.findViewById(R.id.timestamp)
        }
    }
}