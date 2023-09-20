package com.example.colorimagemobile.ui.home.fragments.teams

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager
class TeamsFragment : Fragment(R.layout.fragment_teams) {

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        MyFragmentManager(requireActivity()).open(R.id.teamsMenuFrameLayout, TeamsMenuFragment())
    }
}