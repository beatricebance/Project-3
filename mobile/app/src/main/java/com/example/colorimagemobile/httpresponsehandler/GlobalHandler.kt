package com.example.colorimagemobile.httpresponsehandler

import android.content.Context
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.HTTPResponseModel
import com.example.colorimagemobile.utils.CommonFun

class GlobalHandler{

    // for all update and delete request for user
    fun response(context : Context, HTTPResponse: DataWrapper<HTTPResponseModel.UserResponse>) {
        // some error occurred during HTTP request
        if (HTTPResponse.isError as Boolean) {
            context?.let { CommonFun.printToast(it, HTTPResponse.message as String) }
            return
        }
        // request successfully
        context?.let { CommonFun.printToast(it, "Request succeed") }
    }
}