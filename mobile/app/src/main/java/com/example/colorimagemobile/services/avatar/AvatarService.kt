package com.example.colorimagemobile.services.avatar

import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.utils.Constants

object AvatarService {
    private lateinit var allAvatar : ArrayList<AvatarModel.AllInfo>
    private var currentAvatar : AvatarModel.AllInfo

    init {
        currentAvatar = AvatarModel.AllInfo(Constants.EMPTY_STRING,Constants.EMPTY_STRING,Constants.AVATAR_ALL_INFO_DEFAULT)
    }

    fun setAvatars(allAvatar:ArrayList<AvatarModel.AllInfo>){
        this.allAvatar  = allAvatar

    }
    fun getAvatars() : ArrayList<AvatarModel.AllInfo> {
        return this.allAvatar
    }

    fun setCurrentAvatar(ChosenAvatar : AvatarModel.AllInfo){
       this.currentAvatar = ChosenAvatar
    }

    fun getCurrentAvatar (): AvatarModel.AllInfo{
        return this.currentAvatar
    }


}