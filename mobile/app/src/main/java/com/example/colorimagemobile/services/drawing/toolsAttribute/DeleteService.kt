package com.example.colorimagemobile.services.drawing.toolsAttribute

import com.example.colorimagemobile.classes.toolsCommand.DeleteCommand

object DeleteService {
    var deleteCommand: DeleteCommand? = null

    fun deleteSelectedLayer() {
        deleteCommand = DeleteCommand(SelectionService.selectedShape)
        deleteCommand!!.execute()
    }
}