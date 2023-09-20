package com.example.colorimagemobile.services

object SearchService {

    private var query: String? = null

    fun getQuery(): String? {
        return query
    }

    fun setQuery(newQuery: String) {
        query = newQuery.lowercase()
    }

    fun clear() {
        query = null
    }
}