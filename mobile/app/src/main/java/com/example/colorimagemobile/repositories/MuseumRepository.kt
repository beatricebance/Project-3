package com.example.colorimagemobile.repositories

import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.*
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.services.users.UserService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MuseumRepository {

    private val httpClient = RetrofitInstance.HTTP

    fun getAllPosts(): MutableLiveData<DataWrapper<ArrayList<MuseumPostModel>>> {
        val postsLiveData: MutableLiveData<DataWrapper<ArrayList<MuseumPostModel>>> = MutableLiveData()

        httpClient.getAllPosts(token = "Bearer ${UserService.getToken()}").enqueue(object : Callback<ArrayList<MuseumPostModel>> {
            override fun onResponse(call: Call<ArrayList<MuseumPostModel>>, response: Response<ArrayList<MuseumPostModel>>) {
                if (!response.isSuccessful) {
                    postsLiveData.value = DataWrapper(null, "An error occurred while fetching museum's posts!", true)
                    return
                }
                postsLiveData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<ArrayList<MuseumPostModel>>, t: Throwable) {
                postsLiveData.value = DataWrapper(null, "Sorry, failed to get fetch museum's posts!", true)
            }
        })

        return postsLiveData
    }

    fun postComment(postId: String, comment: CommentInterface): MutableLiveData<DataWrapper<CommentInterface>> {
        val postCommentLiveData: MutableLiveData<DataWrapper<CommentInterface>> = MutableLiveData()

        httpClient.postComment(token = "Bearer ${UserService.getToken()}", postId, comment).enqueue(object : Callback<CommentInterface> {
            override fun onResponse(call: Call<CommentInterface>, response: Response<CommentInterface>) {
                if (!response.isSuccessful) {
                    postCommentLiveData.value = DataWrapper(null, "An error occurred while posting comment!", true)
                    return
                }

                postCommentLiveData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<CommentInterface>, t: Throwable) {
                postCommentLiveData.value = DataWrapper(null, "Sorry, failed to post comment!", true)
            }
        })

        return postCommentLiveData
    }

    fun likePost(postId: String): MutableLiveData<DataWrapper<Any>> {
        val likePostData: MutableLiveData<DataWrapper<Any>> = MutableLiveData()

        httpClient.likePost(token = "Bearer ${UserService.getToken()}", postId).enqueue(object : Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {
                if (!response.isSuccessful) {
                    likePostData.value = DataWrapper(null, "Could not like Post", true)
                    return
                }
                likePostData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                likePostData.value = DataWrapper(null, "Could not like Post", true)
            }
        })

        return likePostData
    }

    fun unlikePost(postId: String): MutableLiveData<DataWrapper<Any>> {
        val unlikePostData: MutableLiveData<DataWrapper<Any>> = MutableLiveData()

        httpClient.unlikePost(token = "Bearer ${UserService.getToken()}", postId).enqueue(object : Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {
                if (!response.isSuccessful) {
                    unlikePostData.value = DataWrapper(null, "Could not unlike Post", true)
                    return
                }
                unlikePostData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<Any>, t: Throwable) {
                unlikePostData.value = DataWrapper(null, "Could not unlike Post", true)
            }
        })

        return unlikePostData
    }
}