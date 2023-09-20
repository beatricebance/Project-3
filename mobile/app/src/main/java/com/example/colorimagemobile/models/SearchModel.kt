package com.example.colorimagemobile.models

import java.io.Serializable

data class SearchModel (
    val users: ArrayList<UserModel.AllInfo>,
    val teams: ArrayList<TeamModel>,
    val drawings: ArrayList<DrawingModel.CreateDrawing>
): Serializable