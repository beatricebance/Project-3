package com.example.colorimagemobile.classes

import java.text.DateFormat
import java.text.SimpleDateFormat
import java.util.*

class DateFormatter {

    companion object {
        fun getDate(dateString: String): String {
            val outputFormat: DateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.US)
            val inputFormat: DateFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSX", Locale.US)

            val date: Date = inputFormat.parse(dateString)!!
            return outputFormat.format(date)
        }
    }
}