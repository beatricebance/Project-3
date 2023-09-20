package com.example.colorimagemobile.models

import com.google.gson.annotations.SerializedName

class AvatarModel {
    data class AllInfo(
        @SerializedName("_id")
        val _id : String,

        @SerializedName("imageUrl")
        val imageUrl: String,

        @SerializedName("default")
        val default : Boolean
    )

}
