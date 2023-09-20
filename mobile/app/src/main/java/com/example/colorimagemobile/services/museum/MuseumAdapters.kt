package com.example.colorimagemobile.services.museum

import com.example.colorimagemobile.adapter.MuseumPostRecyclerAdapter
import com.example.colorimagemobile.adapter.PostCommentsRecyclerAdapter

object MuseumAdapters {
    private lateinit var postsAdapter: MuseumPostRecyclerAdapter
    private val commentsAdapter: HashMap<Int, PostCommentsRecyclerAdapter> = hashMapOf()
    private val postsLikes: HashMap<Int, MuseumPostRecyclerAdapter.ViewHolder> = hashMapOf()

    fun setPostsAdapter(newPostRecyclerAdapter: MuseumPostRecyclerAdapter) {
        postsAdapter = newPostRecyclerAdapter
    }

    fun setCommentRecycler(position: Int, commentsRecyclerAdapter: PostCommentsRecyclerAdapter) {
        commentsAdapter[position] = commentsRecyclerAdapter
    }

    fun getCommentAdapter(position: Int): PostCommentsRecyclerAdapter {
        return commentsAdapter[position]!!
    }

    fun refreshCommentAdapter(position: Int) {
        commentsAdapter[position]?.notifyDataSetChanged()
    }

    fun setPostsLikes(position: Int, holder: MuseumPostRecyclerAdapter.ViewHolder) {
        postsLikes[position] = holder
    }

    fun refreshLikeSection(position: Int) {
        if (postsLikes[position] != null) postsAdapter.showFilledLike(postsLikes[position]!!)
    }

    fun refreshUnlikeSection(position: Int) {
        if (postsLikes[position] != null) postsAdapter.hideFilledLike(postsLikes[position]!!)
    }
}