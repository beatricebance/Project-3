package com.example.colorimagemobile.services

import android.content.Context
import android.content.SharedPreferences
import com.example.colorimagemobile.utils.Constants
import com.google.gson.Gson

class SharedPreferencesService(context: Context) {

    private var sharedPreferences: SharedPreferences

    init {
        sharedPreferences = context.getSharedPreferences(Constants.STORAGE_KEY.MAIN, Context.MODE_PRIVATE)
    }

    // saves an item with a key to localStorage
    fun setItem(key: String, item: String) {
        if (key.isNullOrEmpty()) return

        val editor = sharedPreferences.edit()
        editor.apply {
            putString(key, item)
        }.apply()
    }

    // saves an object with a key to localStorage
    fun setObjectItem(key: String, item: Any) {
        if (key.isNullOrEmpty()) return

        val gson = Gson()
        val stringObject = gson.toJson(item)

        val editor = sharedPreferences.edit()
        editor.apply {
            putString(key, stringObject)
        }.apply()
    }

    // retrieves an item from localStorage by key
    fun getItem(key: String): String {
        return sharedPreferences.getString(key, "").toString()
    }

    // retrieves an item from localStorage by key
    fun <T> getObjectItem(key: String, type: Class<T>): T {
        val gson = Gson()
        val jsonString = sharedPreferences.getString(key, "").toString()
        return gson.fromJson(jsonString, type)
    }

    // removes a specific key from localStorage
    fun removeItem(key: String) {
        if (key.isNullOrEmpty()) return

        val editor = sharedPreferences.edit()
        editor.apply {
            remove(key)
        }.apply()
    }

    // removes everything from localStorage
    fun clear() {
        val editor = sharedPreferences.edit()
        editor.clear().apply()
    }
}