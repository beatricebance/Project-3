package com.example.colorimagemobile.repositories

import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.SearchModel
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.services.users.UserService
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchRepository {

    private val httpClient = RetrofitInstance.HTTP

    fun getSearchQuery(query: String): MutableLiveData<DataWrapper<SearchModel>> {
        val teamsLiveData: MutableLiveData<DataWrapper<SearchModel>> = MutableLiveData()

        httpClient.getSearchQuery(token = "Bearer ${UserService.getToken()}", query).enqueue(object : Callback<SearchModel> {
            override fun onResponse(call: Call<SearchModel>, response: Response<SearchModel>) {
                if (!response.isSuccessful) {
                    teamsLiveData.value = DataWrapper(null, "An error occurred while fetching all teams!", true)
                    return
                }
                teamsLiveData.value = DataWrapper(response.body(), "", false)
            }
            override fun onFailure(call: Call<SearchModel>, t: Throwable) {
                teamsLiveData.value = DataWrapper(null, "Sorry, failed to get fetch teams messages!", true)
            }
        })

        return teamsLiveData
    }
}