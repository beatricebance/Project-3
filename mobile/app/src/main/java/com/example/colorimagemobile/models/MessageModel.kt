package com.example.colorimagemobile.models

import com.google.gson.annotations.SerializedName

class MessageModel {
    data class SendMessage(var message: String,var timestamp: String,var author: String,var roomId: String,var roomName: String)


    data class AllInfo (
        @SerializedName("_id")
        var _id : String?,

        @SerializedName("message")
        var message: String,

        @SerializedName("timestamp")
        var timestamp: String,

        @SerializedName("author")
        var author: String,

        @SerializedName("roomId")
        var roomId: String,

        @SerializedName("roomName")
        var roomName: String,
    )

}