package com.example.colorimagemobile.ui.home.fragments.users

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager

class UsersFragment : Fragment(R.layout.fragment_users) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        MyFragmentManager(requireActivity()).open(R.id.usersMenuFrameLayout, UsersMenuFragment())
    }

}