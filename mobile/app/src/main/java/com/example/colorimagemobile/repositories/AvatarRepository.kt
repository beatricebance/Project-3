package com.example.colorimagemobile.repositories

import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.services.avatar.AvatarService
import com.example.colorimagemobile.services.users.UserService
import okhttp3.MediaType
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.File
import okhttp3.RequestBody
import okhttp3.MultipartBody

class AvatarRepository {
    private val httpClient = RetrofitInstance.HTTP
    private val token = UserService.getToken()

    // get all avatar
    fun getAllAvatar(): MutableLiveData<DataWrapper<ArrayList<AvatarModel.AllInfo>>> {
        val AllAvatarData: MutableLiveData<DataWrapper<ArrayList<AvatarModel.AllInfo>>> = MutableLiveData()

        httpClient.getAllAvatar(token = "Bearer $token").enqueue(object :
            Callback<ArrayList<AvatarModel.AllInfo>> {
            override fun onResponse(call: Call<ArrayList<AvatarModel.AllInfo>>, response: Response<ArrayList<AvatarModel.AllInfo>>) {
                if (!response.isSuccessful) {
                    AllAvatarData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                AllAvatarData.value = DataWrapper(response.body(), null, false)
            }
            override fun onFailure(call: Call<ArrayList<AvatarModel.AllInfo>>, t: Throwable) {
                AllAvatarData.value = DataWrapper(null, "Failed to fetch all avatar from database!", true)
            }
        })

        return AllAvatarData
    }

    // upload avatar
    fun uploadAvatar(file : File): MutableLiveData<DataWrapper<AvatarModel.AllInfo>> {
        val avatarUploadData: MutableLiveData<DataWrapper<AvatarModel.AllInfo>> = MutableLiveData()
        val filePart = MultipartBody.Part.createFormData(
            "avatar",
            file.name,
            RequestBody.create(MediaType.parse("image/*"), file)
        )

        httpClient.uploadAvatar(token = "Bearer $token",filePart).enqueue(object : Callback<AvatarModel.AllInfo> {
            override fun onResponse(call: Call<AvatarModel.AllInfo>, response: Response<AvatarModel.AllInfo>) {
                if (!response.isSuccessful) {
                    avatarUploadData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                // avatar successfully upload
                avatarUploadData.value = DataWrapper(response.body(), "", false)
                AvatarService.setCurrentAvatar(response.body()!!)
            }
            override fun onFailure(call: Call<AvatarModel.AllInfo>, t: Throwable) {
                avatarUploadData.value = DataWrapper(null, "Failed to upload avatar!", true)
            }
        })

        return avatarUploadData
    }

    // add avatar
    fun postAvatar(avatar: AvatarModel.AllInfo): MutableLiveData<DataWrapper<AvatarModel.AllInfo>> {
        val avatarData: MutableLiveData<DataWrapper<AvatarModel.AllInfo>> = MutableLiveData()

        httpClient.postAvatar(token = "Bearer $token",avatar).enqueue(object : Callback<AvatarModel.AllInfo> {
            override fun onResponse(call: Call<AvatarModel.AllInfo>, response: Response<AvatarModel.AllInfo>) {
                if (!response.isSuccessful) {
                    avatarData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                // avatar successfully add
                avatarData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<AvatarModel.AllInfo>, t: Throwable) {
                avatarData.value = DataWrapper(null, "Failed to add avatar!", true)
            }
        })

        return avatarData
    }

}