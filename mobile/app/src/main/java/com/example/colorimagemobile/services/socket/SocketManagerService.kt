package com.example.colorimagemobile.services.socket

import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.Constants

object SocketManagerService {

    // call this to disconnect from every socket
    fun disconnectFromAll() {
        DrawingSocketService.disconnect()
        ChatSocketService.disconnect()
    }

    fun leaveDrawingRoom() {
        if (DrawingService.getCurrentDrawingID() == null) return

        DrawingSocketService.leaveRoom(Constants.SocketRoomInformation(UserService.getUserInfo()._id, DrawingService.getCurrentDrawingID()!!))
//        DrawingSocketService.disconnect()
    }
}