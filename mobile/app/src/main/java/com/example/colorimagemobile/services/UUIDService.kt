package com.example.colorimagemobile.services

import java.util.*

object UUIDService {

    fun generateUUID(): String {
        val uuid = UUID.randomUUID()
        return uuid.toString()
    }
}