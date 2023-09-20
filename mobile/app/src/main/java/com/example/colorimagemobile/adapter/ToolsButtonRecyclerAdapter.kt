package com.example.colorimagemobile.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.tools.ToolsFactory
import com.example.colorimagemobile.enumerators.ToolType
import com.google.android.material.button.MaterialButton

class ToolsButtonRecyclerAdapter(
    val context: Context,
    val tools: ArrayList<ToolType>,
    val openTool: (Int) -> Unit
): RecyclerView.Adapter<ToolsButtonRecyclerAdapter.ViewHolder>() {

    var selectedPosition = 1

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ToolsButtonRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.recycler_tools_button, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ToolsButtonRecyclerAdapter.ViewHolder, position: Int) {
        val tool = ToolsFactory().getTool(tools[position])

        val iconColor = if (selectedPosition == position) R.color.mainTheme else R.color.black
        val backgroundColor = if (selectedPosition == position) R.color.primary else R.color.mainTheme
        holder.toolBtn.setBackgroundColor(ContextCompat.getColor(context, backgroundColor))

        val drawable = ContextCompat.getDrawable(context, tool.getIcon())
        holder.toolBtn.icon = drawable
        holder.toolBtn.setIconTintResource(iconColor)
    }

    override fun getItemCount(): Int { return tools.size }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        val toolBtn: MaterialButton = itemView.findViewById(R.id.tool_btn)

        init {
            toolBtn.setOnClickListener {
                openTool(bindingAdapterPosition)
                selectedPosition = bindingAdapterPosition
                notifyDataSetChanged()
            }
        }
    }
}