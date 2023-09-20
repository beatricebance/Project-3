package com.example.colorimagemobile.services.chat

import androidx.fragment.app.FragmentActivity
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.models.ChatSocketModel
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.ui.home.fragments.chat.ChatMessageBoxFragment
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.HashMap

/**
 * based on current channel:
 * hasFetchedOldMsg: Boolean to check if we have already loaded previous messages or not
 * messages: its chat messages
 */
data class ChatMessage(var hasFetchedOldMsg: Boolean, val messages: MutableSet<ChatSocketModel>)

object ChatService {
    // roomName: [messages]
    private var channelMessages: HashMap<String, ChatMessage> = HashMap()

    // create message list for specific room
    fun addChat(name: String) {
        if (!channelMessages.containsKey(name)) {
            channelMessages[name] = ChatMessage(false, mutableSetOf())
        }
    }

    // add message to a room
    fun addMessage(message: ChatSocketModel) {
        channelMessages[message.roomName]!!.messages.add(message)
    }

    // get messages of a specific room
    fun getChannelMessages(roomName: String): MutableSet<ChatSocketModel>? {
        return channelMessages[roomName]!!.messages
    }

    fun setHasFetchedMessages(channelName: String) {
        channelMessages[channelName]!!.hasFetchedOldMsg = true
    }

    fun shouldHideLoadPreviousBtn(channelName: String): Boolean {
        return channelMessages[channelName]!!.hasFetchedOldMsg
    }

    fun refreshChatBox(fragmentActivity: FragmentActivity) {
        MyFragmentManager(fragmentActivity).open(R.id.chat_channel_framelayout, ChatMessageBoxFragment())
    }

    // add previous channels to the beginning of channel
    fun addToStartOfChannel(channelName: String, oldMessages: ArrayList<ChatSocketModel>) {
        val currentMessages = channelMessages[channelName]!!.messages
        oldMessages.addAll(currentMessages)
        channelMessages[channelName]!!.messages.clear()
        channelMessages[channelName]!!.messages.addAll(oldMessages)
    }

    fun createMessage(message: String): ChatSocketModel {
        return ChatSocketModel(
            _id = null,
            message = message,
            timestamp = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date()),
            author = UserService.getUserInfo().username,
            _roomId = TextChannelService.getCurrentChannel()._id,
            roomName = TextChannelService.getCurrentChannel().name
        )
    }
}