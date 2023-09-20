package com.example.colorimagemobile.models

// model class for API Response
class HTTPResponseModel {
    data class LoginResponse(val user: UserModel.AllInfo, val token: String, val info: String, val error: String)
    data class RegisterResponse(val user: UserModel.AllInfo, val token: String, val info: String, val error: String)
    data class UserResponse(val user: UserModel.AllInfo, val err: String)

}
