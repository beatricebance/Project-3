package com.example.colorimagemobile.classes.toolsCommand.selectionToolCommands

import com.example.colorimagemobile.interfaces.ICommand
import com.example.colorimagemobile.models.*
import com.example.colorimagemobile.services.drawing.toolsAttribute.SelectionService

class SelectionCommand(var selectionData: SelectionData): ICommand {

    init {
        SelectionService.initSelectionRectangle()
    }

    override fun update(drawingCommand: Any) {
    }

    override fun execute() {
    }
}