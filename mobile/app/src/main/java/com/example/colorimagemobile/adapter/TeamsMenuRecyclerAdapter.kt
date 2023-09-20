package com.example.colorimagemobile.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.teams.TeamService
import com.google.android.material.button.MaterialButton

class TeamsMenuRecyclerAdapter(
        val layoutID: Int,
        val openTeam: (Int) -> Unit):
    RecyclerView.Adapter<TeamsMenuRecyclerAdapter.ViewHolder>() {

    // create card view and sets its contents format
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TeamsMenuRecyclerAdapter.ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(layoutID, parent, false)
        return ViewHolder(view)
    }

    // populate each data to cardview
    override fun onBindViewHolder(holder: TeamsMenuRecyclerAdapter.ViewHolder, position: Int) {
        holder.teamName.text = TeamService.getAllTeams()[position].name
        holder.teamDescription.text = TeamService.getAllTeams()[position].description
    }

    // identify how many item we pass to view holder
    override fun getItemCount(): Int {
        return TeamService.getAllTeams().size
    }

    inner class ViewHolder(itemView: View): RecyclerView.ViewHolder(itemView) {
        var teamName : TextView = itemView.findViewById(R.id.card_team_name);
        var teamDescription : TextView = itemView.findViewById(R.id.card_team_description);

        init {
            itemView.setOnClickListener { openTeam(bindingAdapterPosition) }
        }
    }
}