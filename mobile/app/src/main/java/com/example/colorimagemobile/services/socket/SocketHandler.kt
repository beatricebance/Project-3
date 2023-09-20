package com.example.colorimagemobile.services.socket

import com.example.colorimagemobile.utils.Constants
import io.socket.client.IO
import io.socket.client.Socket
import java.net.URISyntaxException

object SocketHandler {
    private lateinit var mSocket: Socket

    @Synchronized
    fun setSocket(namespace: String) {
        try {
            mSocket = IO.socket("${Constants.URL.SERVER}/$namespace")
        } catch (e: URISyntaxException) {
            print("Error setting up socket $e")
        }
    }

    @Synchronized
    fun getSocket(): Socket {
        return mSocket
    }
}