package com.example.colorimagemobile.models

data class CommentInterface(
    val content: String,
    val author: UserModel.AllInfo,
    val postId: String,
    var createdAt: String?,
    val updatedAt: String?,
)

data class MuseumPostModel(
    val _id: String,
    val dataUri: String,
    val owner: UserModel.AllInfo,
    val ownerModel: String,
    val name: String,
    val comments: ArrayList<CommentInterface>,
    val likes: ArrayList<String>,
    var createdAt: String?,
    val updatedAt: String?,
)
