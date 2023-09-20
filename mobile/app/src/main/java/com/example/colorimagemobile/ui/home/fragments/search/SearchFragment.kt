package com.example.colorimagemobile.ui.home.fragments.search

import android.annotation.SuppressLint
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.models.SearchModel
import com.example.colorimagemobile.services.SearchService
import com.example.colorimagemobile.services.teams.TeamAdapterService
import com.example.colorimagemobile.services.teams.TeamService
import com.example.colorimagemobile.services.users.UserAdapterService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun
import com.example.colorimagemobile.utils.Constants
import com.google.android.material.tabs.TabLayout
import kotlinx.android.synthetic.main.fragment_search.*

class SearchFragment : Fragment(R.layout.fragment_search) {
    private lateinit var queryObject: SearchModel
    private lateinit var myView: View
    private lateinit var recyclerView: RecyclerView
    private lateinit var noResultParent: RelativeLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            queryObject = it.getSerializable(Constants.SEARCH.CURRENT_QUERY) as SearchModel
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        myView = view
        recyclerView = myView.findViewById(R.id.searchRecycler)
        noResultParent = myView.findViewById(R.id.searchResultMain)

        setListeners()
        setDrawings()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setListeners() {
        myView.findViewById<TabLayout>(R.id.searchTabLayout).addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                noResultParent.visibility = View.GONE

                when (tab!!.position) {
                    0 -> setDrawings()
                    1 -> setUsers()
                    else -> setTeams()
                }
            }
            override fun onTabReselected(tab: TabLayout.Tab?) { }
            override fun onTabUnselected(tab: TabLayout.Tab?) { }
        })
        myView.findViewById<View>(R.id.searchMainFragment).setOnTouchListener { v, event -> CommonFun.hideKeyboard(requireContext(), searchMainFragment)}
    }

    // add DrawingRecyclerAdapter
    private fun setDrawings() {
        if (validateSearchUI(queryObject.drawings.size, "drawings")) { return }
    }

    private fun setUsers() {
        if (validateSearchUI(queryObject.users.size, "users")) { return }

        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        UserService.setAllUserInfo(queryObject.users)

        val adapter = UserAdapterService.createAdapter(requireContext(), requireActivity(), R.layout.recycler_search_user_menu, R.id.searchMainFragment)
        recyclerView.adapter = adapter
        UserAdapterService.setAdapter(adapter)
    }

    private fun setTeams() {
        if (validateSearchUI(queryObject.teams.size, "teams")) { return }

        recyclerView.layoutManager = LinearLayoutManager(requireContext())
        TeamService.setAllTeams(queryObject.teams)

        val adapter = TeamAdapterService.createAdapter(requireActivity(), R.layout.recycler_search_team_menu, R.id.searchMainFragment)
        recyclerView.adapter = adapter
        TeamAdapterService.setAdapter(adapter)
    }

    // if result is empty, hide recycler view and show no results msg
    private fun validateSearchUI(size: Int, categoryName: String): Boolean {
        recyclerView.adapter = null

        if (size == 0) {
            noResultParent.findViewById<TextView>(R.id.searchNoResult).text = "Couldn't find any $categoryName corresponding to following search:"
            noResultParent.findViewById<TextView>(R.id.searchNoResultQuery).text = SearchService.getQuery()
            showEmptyResult()
            return true
        }

        recyclerView.visibility = View.VISIBLE
        return false
    }

    private fun showEmptyResult() {
        noResultParent.visibility = View.VISIBLE
        recyclerView.visibility = View.GONE
    }
}