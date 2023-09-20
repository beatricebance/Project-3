package com.example.colorimagemobile.ui.home.fragments.teams

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.Button
import android.widget.RelativeLayout
import android.widget.TextView
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.adapter.DrawingMenuRecyclerAdapter
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.models.DrawingModel
import com.example.colorimagemobile.models.TeamModel
import com.example.colorimagemobile.models.recyclerAdapters.DrawingMenuData
import com.example.colorimagemobile.repositories.DrawingRepository
import com.example.colorimagemobile.repositories.TeamRepository
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.teams.TeamService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.CommonFun.Companion.toggleButton
import com.example.colorimagemobile.utils.Constants
import com.google.android.material.tabs.TabLayout

class TeamsProfileFragment : Fragment(R.layout.fragment_teams_profile) {
    private var teamPosition: Int? = null
    private lateinit var currentTeam: TeamModel
    private lateinit var myView: View
    private lateinit var recyclerView: RecyclerView
    private var drawingsMenu: ArrayList<DrawingMenuData> = arrayListOf()
    private lateinit var joinBtn: Button
    private lateinit var leaveBtn: Button
    private lateinit var deleteBtn: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            teamPosition = it.getInt(Constants.TEAMS.CURRENT_TEAM_ID_KEY)
            currentTeam = TeamService.getTeam(teamPosition!!)
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        myView = view
        recyclerView = myView.findViewById(R.id.teamProfileDrawingsRecycler)
        recyclerView.layoutManager = GridLayoutManager(requireContext(), Constants.NB_DATA_ROWS)

        updateUI()
        setListeners()
        getTeamDrawings()
    }

    private fun updateUI() {
        MyFragmentManager(requireActivity()).showBackButton()
        
        myView.findViewById<TextView>(R.id.teamIdNameCard).text = currentTeam.name

//        myView.findViewById<ImageView>(R.id.teamIdImageView).
        myView.findViewById<TextView>(R.id.teamIdNbOfMembers).text = "${currentTeam.members.size} members"
        myView.findViewById<TextView>(R.id.teamIdDescription).text = currentTeam.description

        joinBtn = myView.findViewById<Button>(R.id.teamIdJoinBtn)
        leaveBtn = myView.findViewById<Button>(R.id.leaveTeamIdBtn)
        deleteBtn = myView.findViewById<Button>(R.id.deleteTeamIdBtn)

        if (currentTeam.owner == UserService.getUserInfo()._id) {
            myView.findViewById<RelativeLayout>(R.id.teamIdJoinBtnMain).visibility = View.GONE
            myView.findViewById<RelativeLayout>(R.id.deleteTeamIdBtnMain).visibility = View.VISIBLE
        } else {
            myView.findViewById<RelativeLayout>(R.id.teamIdJoinBtnMain).visibility = View.VISIBLE
            myView.findViewById<RelativeLayout>(R.id.deleteTeamIdBtnMain).visibility = View.GONE
            updateTeamButtons()
        }
    }

    private fun updateTeamButtons() {
        if (TeamService.isUserAlreadyTeamMember(teamPosition!!)) {
            hideJoinBtn()
        } else {
            showJoinBtn()
            checkIsTeamFull(joinBtn)
        }
    }

    private fun hideJoinBtn() {
        joinBtn.visibility = View.GONE
        leaveBtn.visibility = View.VISIBLE
    }

    private fun showJoinBtn() {
        joinBtn.visibility = View.VISIBLE
        leaveBtn.visibility = View.GONE
    }

    private fun checkIsTeamFull(button: Button) {
        currentTeam.memberLimit?.let {
            if (currentTeam.members.size >= currentTeam.memberLimit!!) {
                toggleButton(button, false)
            }
        }
    }

    private fun setListeners() {
        myView.findViewById<TabLayout>(R.id.teamProfileDrawingsTabLayout).addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                when (tab!!.position) {
                    0 -> setAllDrawings()
                    else -> setPublishedDrawings()
                }
            }
            override fun onTabReselected(tab: TabLayout.Tab?) { }
            override fun onTabUnselected(tab: TabLayout.Tab?) { }
        })

        joinBtn.setOnClickListener {
            TeamService.joinTeam(teamPosition!!, requireContext())
            hideJoinBtn()
        }
        leaveBtn.setOnClickListener {
            TeamService.leaveTeam(teamPosition!!, requireContext())
            showJoinBtn()
        }
        deleteBtn.setOnClickListener {
            TeamService.deleteTeam(teamPosition!!, requireContext())
        }
    }

    private fun getTeamDrawings() {
        TeamRepository().getTeamDrawings(currentTeam._id).observe(viewLifecycleOwner, {
            if (it.isError as Boolean) {
                return@observe
            }

            val drawings = it.data as List<DrawingModel.Drawing>
            drawingsMenu = DrawingService.getDrawingsBitmap(requireContext(), drawings)
            setAllDrawings()
        })
    }

    private fun setAllDrawings() {
        recyclerView.adapter = DrawingMenuRecyclerAdapter(requireActivity(), drawingsMenu, R.id.teamsMenuFrameLayout) { updatedDrawing, pos -> updateDrawing(updatedDrawing, pos) }
    }

    private fun setPublishedDrawings() {
        val drawings = arrayListOf<DrawingMenuData>()
//        recyclerView.adapter = DrawingMenuRecyclerAdapter(requireActivity(), drawings, R.id.teamsMenuFrameLayout, {_,_ -> {}})
    }

    private fun updateDrawing(updatedDrawing: DrawingModel.UpdateDrawing, position: Int) {
        DrawingRepository().updateDrawing(drawingsMenu[position].drawing._id!!, updatedDrawing).observe(viewLifecycleOwner, {
            if (it.isError as Boolean) {
                printToast(requireActivity(), it.message!!)
                return@observe
            }

            drawingsMenu[position] = DrawingService.updateDrawingFromMenu(drawingsMenu[position], updatedDrawing)
            recyclerView.adapter?.notifyItemChanged(position)
        })
    }
}