package com.example.colorimagemobile.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.ImageConvertor
import com.example.colorimagemobile.services.museum.MuseumAdapters
import com.example.colorimagemobile.services.museum.MuseumPostService
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard
import com.example.colorimagemobile.utils.CommonFun.Companion.onEnterKeyPressed

class MuseumPostRecyclerAdapter(
    context: Context,
    val postComment: (Int, String) -> Unit,
    val likePost: (Int) -> Unit,
    val unlikePost: (Int) -> Unit
) : RecyclerView.Adapter<MuseumPostRecyclerAdapter.ViewHolder>() {

    private val context = context

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MuseumPostRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.recycler_museum_posts, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: MuseumPostRecyclerAdapter.ViewHolder, position: Int) {
        val currentPost = MuseumPostService.getPosts()[position]

        val bitmap = ImageConvertor(context).renderBase64ToBitmap(currentPost.dataUri)
        if (bitmap != null) { holder.image.setImageBitmap(bitmap) }

        val adapter = PostCommentsRecyclerAdapter(MuseumPostService.getPosts()[position])
        MuseumAdapters.setCommentRecycler(position, adapter)
        MuseumAdapters.setPostsLikes(position, holder)

        // set up comments section on the right
        holder.commentRecyclerView.layoutManager = LinearLayoutManager(context)
        holder.commentRecyclerView.adapter = MuseumAdapters.getCommentAdapter(position)

        holder.museumCurrentNb.text = "#${position + 1}"
        holder.museumName.text = currentPost.name

        // set like heart
        if (MuseumPostService.hasLiked(currentPost)) showFilledLike(holder) else hideFilledLike(holder)
    }

    fun showFilledLike(holder: ViewHolder) {
        holder.unlikeBtn.visibility = View.GONE
        holder.likeBtn.visibility = View.VISIBLE
    }

    fun hideFilledLike(holder: ViewHolder) {
        holder.unlikeBtn.visibility = View.VISIBLE
        holder.likeBtn.visibility = View.GONE
    }

    override fun getItemCount(): Int { return MuseumPostService.getPosts().size }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val museumCurrentNb: TextView = itemView.findViewById(R.id.museumCurrentNb)
        val museumName: TextView = itemView.findViewById(R.id.museum_post_name)
        val image : ImageView = itemView.findViewById(R.id.postImage)
        val commentRecyclerView: RecyclerView = itemView.findViewById(R.id.museum_comments_recycler_view)
        private val commentEditText: EditText = itemView.findViewById(R.id.post_comment_input)
        private val postCommentButton: Button = itemView.findViewById(R.id.post_comment_btn)

        val unlikeBtn: ImageButton = itemView.findViewById(R.id.museum_post_like_outline)
        val likeBtn: ImageButton = itemView.findViewById(R.id.museum_post_like_filled)

        init {
            postCommentButton.setOnClickListener {
                postComment(bindingAdapterPosition, commentEditText.text.toString())
                commentEditText.text = null
            }

            itemView.setOnClickListener { hideKeyboard(itemView.context, itemView) }
            commentRecyclerView.setOnClickListener { hideKeyboard(itemView.context, commentRecyclerView) }
            onEnterKeyPressed(commentEditText) {
                postComment(bindingAdapterPosition, commentEditText.text.toString())
                commentEditText.text = null
                hideKeyboard(itemView.context, itemView)
            }

            // wants to like
            unlikeBtn.setOnClickListener { likePost(bindingAdapterPosition) }

            // wants to unlike
            likeBtn.setOnClickListener { unlikePost(bindingAdapterPosition) }
        }
    }
}