package com.example.colorimagemobile.classes

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentActivity
import androidx.fragment.app.FragmentTransaction
import java.io.Serializable

class MyFragmentManager(activity: FragmentActivity) {
    private var activity: FragmentActivity = activity

    fun closeFragment(fragment: Fragment) {
        activity.supportFragmentManager
            .beginTransaction()
            .remove(fragment)
            .commitAllowingStateLoss()
    }

    // replace and open a fragment with a new one
    fun open(oldFragmentID: Int, newFragmentClass: Fragment) {
        activity.supportFragmentManager
            .beginTransaction()
            .replace(oldFragmentID, newFragmentClass)
            .addToBackStack(null)
            .setTransition(FragmentTransaction.TRANSIT_FRAGMENT_FADE)
            .commitAllowingStateLoss()
    }

    // pass objects
    fun openWithData(oldFragmentID: Int, newFragmentClass: Fragment, key: String, data: Serializable) {
        val args = Bundle()
        args.putSerializable(key, data)
        newFragmentClass.arguments = args

        open(oldFragmentID, newFragmentClass)
    }

    fun openWithData(oldFragmentID: Int, newFragmentClass: Fragment, key: String, data: Int) {
        val args = Bundle()
        args.putInt(key, data)
        newFragmentClass.arguments = args

        open(oldFragmentID, newFragmentClass)
    }

    fun showBackButton() {
        (activity as AppCompatActivity?)?.supportActionBar?.setDisplayHomeAsUpEnabled(true)
    }

    fun hideBackButton() {
        (activity as AppCompatActivity?)?.supportActionBar?.setDisplayHomeAsUpEnabled(false)
    }
}