package com.example.colorimagemobile.repositories

import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.MessageModel
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.services.users.UserService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MessageRepository {

    private val httpClient = RetrofitInstance.HTTP

    // get all Messages
    fun getAllMessage(token: String): MutableLiveData<DataWrapper<List<MessageModel.AllInfo>>> {
        val AllMessageData: MutableLiveData<DataWrapper<List<MessageModel.AllInfo>>> = MutableLiveData()

        httpClient.getAllMessage(token = "Bearer $token").enqueue(object :
            Callback<List<MessageModel.AllInfo>> {
            override fun onResponse(call: Call<List<MessageModel.AllInfo>>, response: Response<List<MessageModel.AllInfo>>) {
                if (!response.isSuccessful) {
                    AllMessageData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                //all message get successfully
                AllMessageData.value = DataWrapper(response.body(), null, false)
            }
            override fun onFailure(call: Call<List<MessageModel.AllInfo>>, t: Throwable) {
                AllMessageData.value = DataWrapper(null, "Failed to get all Message!", true)
            }
        })

        return AllMessageData
    }

    // send new message
    fun sendMessage(newChannel: MessageModel.SendMessage): MutableLiveData<DataWrapper<MessageModel.AllInfo>> {
        val newMessageData: MutableLiveData<DataWrapper<MessageModel.AllInfo>> = MutableLiveData()
        val token = UserService.getToken()
        httpClient.sendMessage(token = "Bearer $token",newChannel).enqueue(object : Callback<MessageModel.AllInfo> {
            override fun onResponse(call: Call<MessageModel.AllInfo>, response: Response<MessageModel.AllInfo>) {
                if (!response.isSuccessful) {
                    newMessageData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                // message send successfully create
                newMessageData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<MessageModel.AllInfo>, t: Throwable) {
                newMessageData.value = DataWrapper(null, "Failed to create message!", true)
            }
        })

        return newMessageData
    }

    // delete message by id
    fun deleteMessageById(id: String): MutableLiveData<DataWrapper<MessageModel.AllInfo>> {
        val token = UserService.getToken()
        val deleteMessageData: MutableLiveData<DataWrapper<MessageModel.AllInfo>> = MutableLiveData()
        httpClient.deleteMessageById(token = "Bearer $token",id).enqueue(object :
            Callback<MessageModel.AllInfo> {
            override fun onResponse(call: Call<MessageModel.AllInfo>, response: Response<MessageModel.AllInfo>) {
                if (!response.isSuccessful) {
                    deleteMessageData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                // message successfully delete
                deleteMessageData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<MessageModel.AllInfo>, t: Throwable) {
                deleteMessageData.value = DataWrapper(null, "Failed to delete message!", true)
            }

        })

        return deleteMessageData
    }

    // store all message
    fun storeMessage(listMessage: List<MessageModel.SendMessage>): MutableLiveData<DataWrapper<List<MessageModel.AllInfo>>> {
        val listMessageToStore: MutableLiveData<DataWrapper<List<MessageModel.AllInfo>>> = MutableLiveData()
        val token = UserService.getToken()
        httpClient.storeMessage(token = "Bearer $token",listMessage).enqueue(object : Callback<List<MessageModel.AllInfo>> {
            override fun onResponse(call: Call<List<MessageModel.AllInfo>>, response: Response<List<MessageModel.AllInfo>>) {
                if (!response.isSuccessful) {
                    listMessageToStore.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                // all messages successfully stored
                listMessageToStore.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<List<MessageModel.AllInfo>>, t: Throwable) {
                listMessageToStore.value = DataWrapper(null, "Failed to store all message!", true)
            }
        })

        return listMessageToStore
    }
}