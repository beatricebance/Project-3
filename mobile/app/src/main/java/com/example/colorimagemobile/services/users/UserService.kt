package com.example.colorimagemobile.services.users

import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.utils.Constants

// Singleton User object which is accessible globally

object UserService {
    private lateinit var info: UserModel.AllInfo
    private var token : String =Constants.EMPTY_STRING
    private var updateProfileData : UserModel.UpdateUser
    private lateinit var allUserInfo : ArrayList<UserModel.AllInfo>

    init {
        updateProfileData =UserModel.UpdateUser(null,null,null)
    }

    fun setAllUserInfo(allInfo:ArrayList<UserModel.AllInfo>){
        allUserInfo = allInfo
    }

    fun getAllUserInfo() : ArrayList<UserModel.AllInfo> {
        return allUserInfo
    }

    fun setNewProfileData (newValues: UserModel.UpdateUser){
        updateProfileData = newValues
    }

    fun getNewProfileData(): UserModel.UpdateUser{
        return updateProfileData
    }

    fun setUserInfo(newUserInfo: UserModel.AllInfo) {
        info = newUserInfo
    }

    fun getUserInfo(): UserModel.AllInfo {
        return info
    }

    fun isNull(): Boolean {
        return !UserService::info.isInitialized
    }

    fun setToken(token:String){
        UserService.token = token
    }

    fun getToken(): String{
        return token
    }

    fun setUserAvatar(avatar: AvatarModel.AllInfo){
     this.info.avatar = avatar
    }

    fun getUser(position: Int): UserModel.AllInfo {
        return allUserInfo[position]
    }

    fun updateUserAfterUpdate(currentdata: UserModel.UpdateUser){
        if (!currentdata.username.isNullOrEmpty()){
            info.username = currentdata.username!!
        }
        if (!currentdata.description.isNullOrEmpty()){
            info.description = currentdata.description!!
        }

    }


}