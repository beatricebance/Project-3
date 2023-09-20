package com.example.colorimagemobile.models

import com.google.gson.annotations.SerializedName

// class for different uses related to User
class UserModel {
    data class Login(val username: String, val password: String)
    data class Register(val firstName: String, val lastName: String, val username: String, val email: String, val password: String,val createdAt : String)
    data class Logout(val username: String)
    data class UpdateUser (
        @SerializedName("username")
        var username: String?,

        @SerializedName("description")
        var description: String?,

        @SerializedName("avatar")
        var avatar : AvatarModel.AllInfo?
        )

    // holds all the data of User
    data class AllInfo(
        @SerializedName("_id")
        val _id: String,

        @SerializedName("username")
        var username: String,

        @SerializedName("firstName")
        val firstName: String,

        @SerializedName("lastName")
        val lastName: String,

        @SerializedName("password")
        val password: String,

        @SerializedName("email")
        val email: String,

        @SerializedName("description")
        var description: String,

        @SerializedName("teams")
        val teams: ArrayList<String>,

        @SerializedName("drawings")
        val drawings: ArrayList<String>,

        @SerializedName("avatar")
        var avatar : AvatarModel.AllInfo
    )
}



