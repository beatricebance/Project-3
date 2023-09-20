package com.example.colorimagemobile.services.drawing

import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.models.DrawingOwner

object DrawingOwnerService {

    fun getUsername(owner: DrawingOwner): String? {
        return owner.username ?: owner.name
    }

    fun getAvatar(owner: DrawingOwner): AvatarModel.AllInfo? {
        return owner.avatar
    }
}