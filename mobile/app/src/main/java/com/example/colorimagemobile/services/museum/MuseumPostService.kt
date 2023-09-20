package com.example.colorimagemobile.services.museum

import com.example.colorimagemobile.models.CommentInterface
import com.example.colorimagemobile.models.MuseumPostModel
import com.example.colorimagemobile.services.users.UserService

object MuseumPostService {

    private lateinit var posts: ArrayList<MuseumPostModel>

    fun setPosts(newPostModel: ArrayList<MuseumPostModel>) {
        posts = newPostModel
    }

    fun getPosts(): ArrayList<MuseumPostModel> {
        return posts
    }

    fun likePost(position: Int) {
        posts[position].likes.add(UserService.getUserInfo()._id)
    }

    fun unlikePost(position: Int) {
        posts[position].likes.remove(UserService.getUserInfo()._id)
    }

    fun hasLiked(currentPost: MuseumPostModel): Boolean {
        return currentPost.likes.contains(UserService.getUserInfo()._id)
    }

    fun addCommentToPost(position: Int, commentInterface: CommentInterface) {
        posts[position].comments.add(commentInterface)
    }

    fun createComment(postId: String, comment: String): CommentInterface {
        return CommentInterface(
            content = comment,
            author = UserService.getUserInfo(),
            postId = postId,
            createdAt = null,
            updatedAt = null
        )
    }
}