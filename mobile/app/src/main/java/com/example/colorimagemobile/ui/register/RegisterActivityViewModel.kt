package com.example.colorimagemobile.ui.register

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.HTTPResponseModel
import com.example.colorimagemobile.repositories.AuthRepository

class RegisterActivityViewModel: ViewModel() {
    private val HTTPResponseLiveData: MutableLiveData<DataWrapper<HTTPResponseModel>>
    private val authRepository: AuthRepository



    init {
        HTTPResponseLiveData = MutableLiveData()
        authRepository = AuthRepository()
    }

    fun registerUser(newUserData: UserModel.Register): LiveData<DataWrapper<HTTPResponseModel.RegisterResponse>> {
        return authRepository.registerUser(newUserData)
    }

}