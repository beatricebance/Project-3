package com.example.colorimagemobile.services.drawing

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData

object CanvasUpdateService {

    private val updateCanvas: MutableLiveData<Boolean> = MutableLiveData()

    // just emitting something to tell the canvas to update
    fun invalidate() {
        updateCanvas.value = true
    }

    fun asyncInvalidate(){
        updateCanvas.postValue(true)
    }

    fun getLiveData(): LiveData<Boolean> {
        return updateCanvas
    }
}