package com.example.colorimagemobile.repositories

import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.MuseumPostModel
import com.example.colorimagemobile.services.RetrofitInstance
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun.Companion.printMsg
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.newSingleThreadContext
import kotlinx.coroutines.runBlocking
import retrofit2.*

class DrawingRepository {

    private val httpClient = RetrofitInstance.HTTP

    fun createNewDrawing(drawing: DrawingModel.CreateDrawing): MutableLiveData<DataWrapper<DrawingModel.Drawing>> {
        val drawingLiveData: MutableLiveData<DataWrapper<DrawingModel.Drawing>> = MutableLiveData()

        httpClient.createNewDrawing(token = "Bearer ${UserService.getToken()}", drawing).enqueue(object : Callback<DrawingModel.Drawing>{
            override fun onResponse(call: Call<DrawingModel.Drawing>, response: Response<DrawingModel.Drawing>) {
                if (!response.isSuccessful) {
                    drawingLiveData.value = DataWrapper(null, "An error occurred while creating drawing!", true)
                    return
                }
                drawingLiveData.value = DataWrapper(response.body(), "Drawing successfully created", false)
            }

            override fun onFailure(call: Call<DrawingModel.Drawing>, t: Throwable) {
                drawingLiveData.value = DataWrapper(null, "Failed to create new drawing!", true)
            }
        })

        return drawingLiveData
    }

    fun getAllDrawings(token: String): MutableLiveData<DataWrapper<ArrayList<DrawingModel.Drawing>>> {
        val liveData: MutableLiveData<DataWrapper<ArrayList<DrawingModel.Drawing>>> = MutableLiveData()
        printMsg("Fetching all drawings")

        httpClient.getAllDrawings(token = "Bearer $token").enqueue(object : Callback<ArrayList<DrawingModel.Drawing>> {
            override fun onResponse(call: Call<ArrayList<DrawingModel.Drawing>>, response: Response<ArrayList<DrawingModel.Drawing>>) {
                if (!response.isSuccessful) {
                    liveData.value = DataWrapper(null, "An error occurred!", true)
                    return
                }
                liveData.value = DataWrapper(response.body(), null, false)
            }

            override fun onFailure(call: Call<ArrayList<DrawingModel.Drawing>>, t: Throwable) {
                printMsg("Failed to get all drawings ${t.message!!}")
                liveData.value = DataWrapper(null, "Failed to get all drawings!", true)
            }
        })

        return liveData
    }

    suspend fun getDrawing(id: String): DrawingModel.Drawing? {
        val response = httpClient.getDrawing(token = "Bearer ${UserService.getToken()}", id).awaitResponse()
        if(response.isSuccessful){
            return response.body()
        }
        return null
    }

    suspend fun saveCurrentDrawing(): DrawingModel.CreateDrawing? {
        val saveDrawing = DrawingModel.SaveDrawing(DrawingObjectManager.getDrawingDataURI())
        val response = httpClient.saveDrawing(
            token = "Bearer ${UserService.getToken()}",
            DrawingService.getCurrentDrawingID()!!,
            saveDrawing
        ).awaitResponse()
        if (response.isSuccessful) {
            return response.body()
        }
        return null
    }

    fun updateDrawing(id: String, drawing: DrawingModel.UpdateDrawing): MutableLiveData<DataWrapper<Any>> {
        val liveData: MutableLiveData<DataWrapper<Any>> = MutableLiveData()

        httpClient.updateDrawing(token = "Bearer ${UserService.getToken()}", id, drawing).enqueue(object : Callback<Any> {
            override fun onResponse(call: Call<Any>, response: Response<Any>) {
                if (!response.isSuccessful) {
                    liveData.value = DataWrapper(null, "An error occurred while updating drawing!", true)
                    return
                }
                liveData.value = DataWrapper(response.body(), null, false)
            }

            override fun onFailure(call: Call<Any>, t: Throwable) {
                liveData.value = DataWrapper(null, "Failed to update drawing!", true)
            }
        })

        return liveData
    }


    fun publishDrawing(drawing: DrawingModel.Drawing): MutableLiveData<DataWrapper<Any>> {
        val drawingLiveData: MutableLiveData<DataWrapper<Any>> = MutableLiveData()

        httpClient.publishDrawing(token = "Bearer ${UserService.getToken()}", DrawingService.getCurrentDrawingID()!!, drawing).enqueue(object : Callback<Any>{
            override fun onResponse(call: Call<Any>, response: Response<Any>) {
                if (!response.isSuccessful) {
                    drawingLiveData.value = DataWrapper(null, "An error occurred while publishing to museum!", true)
                    return
                }
                drawingLiveData.value = DataWrapper(response.body(), "Drawing '${drawing.name}' published to museum!", false)
            }

            override fun onFailure(call: Call<Any>, t: Throwable) {
                drawingLiveData.value = DataWrapper(null, "Failed to create new drawing!", true)
            }
        })

        return drawingLiveData
    }

    fun saveDrawing(saveDrawing: DrawingModel.SaveDrawing): MutableLiveData<DataWrapper<DrawingModel.CreateDrawing>> {
        val drawingLiveData: MutableLiveData<DataWrapper<DrawingModel.CreateDrawing>> = MutableLiveData()

        httpClient.saveDrawing(token = "Bearer ${UserService.getToken()}", DrawingService.getCurrentDrawingID()!!, saveDrawing).enqueue(object : Callback<DrawingModel.CreateDrawing>{
            override fun onResponse(call: Call<DrawingModel.CreateDrawing>, response: Response<DrawingModel.CreateDrawing>) {
                if (!response.isSuccessful) {
                    drawingLiveData.value = DataWrapper(null, "An error occurred while saving drawing!", true)
                    return
                }
                drawingLiveData.value = DataWrapper(response.body(), "", false)
            }

            override fun onFailure(call: Call<DrawingModel.CreateDrawing>, t: Throwable) {
                drawingLiveData.value = DataWrapper(null, "Failed to save drawing!", true)
            }
        })

        return drawingLiveData
    }
}