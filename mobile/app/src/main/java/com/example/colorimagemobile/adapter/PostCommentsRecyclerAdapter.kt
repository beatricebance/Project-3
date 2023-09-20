package com.example.colorimagemobile.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.DateFormatter
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.models.MuseumPostModel
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard

class PostCommentsRecyclerAdapter(currentPost: MuseumPostModel): RecyclerView.Adapter<PostCommentsRecyclerAdapter.ViewHolder>() {

    private val currentPost = currentPost

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostCommentsRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.recycler_museum_post_comments, parent, false)
        return ViewHolder(view)
    }
    override fun onBindViewHolder(holder: PostCommentsRecyclerAdapter.ViewHolder, position: Int) {
        val comment = currentPost.comments[position]

        holder.authorName.text = comment.author.username
        holder.content.text = comment.content
        holder.date.text = DateFormatter.getDate(comment.createdAt!!)

        MyPicasso().loadImage(comment.author.avatar.imageUrl, holder.authorImage)
    }

    override fun getItemCount(): Int { return currentPost.comments.size }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        var authorName : TextView = itemView.findViewById(R.id.post_comment_author);
        var content : TextView = itemView.findViewById(R.id.post_comment_content);
        var date : TextView = itemView.findViewById(R.id.post_comment_date);
        val authorImage: ImageView = itemView.findViewById(R.id.post_comment_author_image)

        init {
            itemView.setOnClickListener { hideKeyboard(itemView.context, itemView) }
        }
    }
}