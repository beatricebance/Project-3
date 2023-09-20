package com.example.colorimagemobile.services.chat

import com.example.colorimagemobile.adapter.ChannelsRecyclerAdapter
import com.example.colorimagemobile.adapter.ChatMessageRecyclerAdapter

object ChatAdapterService {
    private var chatMsgAdapter: ChatMessageRecyclerAdapter = ChatMessageRecyclerAdapter()
    private var channelListAdaper: ChannelsRecyclerAdapter = ChannelsRecyclerAdapter()

    fun getChatMsgAdapter(): ChatMessageRecyclerAdapter {
        return chatMsgAdapter
    }

    fun getChannelListAdapter(): ChannelsRecyclerAdapter {
        return channelListAdaper
    }
}