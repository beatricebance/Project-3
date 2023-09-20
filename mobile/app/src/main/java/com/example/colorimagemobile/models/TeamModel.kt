package com.example.colorimagemobile.models

data class TeamModel(val _id: String, val name: String, val description: String, val owner: String, var members: ArrayList<String>, val drawings: ArrayList<String>, val posts: ArrayList<String>, val memberLimit: Int?)
data class CreateTeamModel(val name: String, val description: String, val memberLimit: Int?, val owner: String)