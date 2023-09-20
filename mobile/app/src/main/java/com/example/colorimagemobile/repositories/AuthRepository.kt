package com.example.colorimagemobile.repositories

import android.util.Log
import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.HTTPResponseModel
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import com.example.colorimagemobile.utils.Constants.Companion.DEBUG_KEY
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AuthRepository {

    private val httpClient = RetrofitInstance.HTTP

    fun loginUser(user: UserModel.Login): MutableLiveData<DataWrapper<HTTPResponseModel.LoginResponse>> {
        val authLiveData: MutableLiveData<DataWrapper<HTTPResponseModel.LoginResponse>> = MutableLiveData()

        httpClient.loginUser(user).enqueue(object : Callback<HTTPResponseModel.LoginResponse> {
            override fun onResponse(call: Call<HTTPResponseModel.LoginResponse>, response: Response<HTTPResponseModel.LoginResponse>) {
                // some HTTP error
                if (!response.isSuccessful) {
                    printMsg(response.message())
                    authLiveData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }

                val body = response.body() as HTTPResponseModel.LoginResponse

                // unsuccessful authentication
                if (!body.error.isNullOrEmpty()) {
                    printMsg(body.error)
                    authLiveData.value = DataWrapper(null, body.error, true)
                    return
                }

                // user logged in successfully
                authLiveData.value = DataWrapper(body, body.info, false)
            }

            // HTTP failure
            override fun onFailure(call: Call<HTTPResponseModel.LoginResponse>, t: Throwable) {
                authLiveData.value = DataWrapper(null, "An error occurred while logging you in!", true)
            }
        })

        return authLiveData
    }

    // when user logs out
    fun logoutUser(user: UserModel.Logout): MutableLiveData<DataWrapper<HTTPResponseModel>>  {
        val authLiveData: MutableLiveData<DataWrapper<HTTPResponseModel>> = MutableLiveData()

        httpClient.logoutUser(user).enqueue(object : Callback<Boolean> {
            override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                if (!response.isSuccessful) {
                    printMsg(response.message())
                    authLiveData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }

                authLiveData.value = DataWrapper(null, "Logging you out ${user.username}!", false)
            }

            override fun onFailure(call: Call<Boolean>, t: Throwable) {
                authLiveData.value = DataWrapper(null, "Failed to you logout!", true)
            }
        })

        return authLiveData
    }

    // create new user
    fun registerUser(newUser: UserModel.Register): MutableLiveData<DataWrapper<HTTPResponseModel.RegisterResponse>> {
        val authLiveData: MutableLiveData<DataWrapper<HTTPResponseModel.RegisterResponse>> = MutableLiveData()

        httpClient.registerUser(newUser).enqueue(object : Callback<HTTPResponseModel.RegisterResponse> {
            override fun onResponse(call: Call<HTTPResponseModel.RegisterResponse>, response: Response<HTTPResponseModel.RegisterResponse>) {
                if (!response.isSuccessful) {
                    Log.d(DEBUG_KEY, response.message())
                    authLiveData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }

                // account successfully created
                authLiveData.value = DataWrapper(response.body(), "", false)
            }

            // duplicate username is coming through here
            override fun onFailure(call: Call<HTTPResponseModel.RegisterResponse>, t: Throwable) {
                Log.d(DEBUG_KEY, "Failed to create account ${t.message!!}")
                authLiveData.value = DataWrapper(null, "Failed to create account!", true)
            }
        })

        return authLiveData
    }
}
