package com.example.colorimagemobile.classes.tools

import com.example.colorimagemobile.enumerators.ToolType
import com.example.colorimagemobile.interfaces.ITool

class ToolsFactory {
    private var tool: ToolType = ToolType.PENCIL

    fun getTool(toolType: ToolType): ITool {
        this.tool = toolType

        return when(this.tool) {
            ToolType.SELECTION -> SelectionTool()
            ToolType.PENCIL -> PencilTool()
            ToolType.RECTANGLE -> RectangleTool()
            ToolType.ELLIPSE -> EllipseTool()
            ToolType.COLOR_PALETTE -> ColorPaletteTool()
        }
    }
}