package com.example.colorimagemobile.services.drawing

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.example.colorimagemobile.enumerators.ToolType

// only save the type of tools
object ToolTypeService {
    private var currentTool: MutableLiveData<ToolType> = MutableLiveData()
    private var tools: ArrayList<ToolType> = arrayListOf()

    init {
        // add every tool in array
        enumValues<ToolType>().forEach {
            tools.add(it)
        }

        this.setCurrentToolType(ToolType.PENCIL)
    }

    fun getCurrentToolType(): LiveData<ToolType> {
        return this.currentTool
    }

    fun setCurrentToolType(toolType: ToolType) {
        this.currentTool.value = toolType
    }

    fun getAllToolTypes(): ArrayList<ToolType> {
        return this.tools
    }
}