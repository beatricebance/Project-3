package com.example.colorimagemobile.ui.home.fragments.users

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.repositories.UserRepository
import com.example.colorimagemobile.services.users.UserAdapterService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun
import com.example.colorimagemobile.utils.Constants


class UsersMenuFragment : Fragment(R.layout.fragment_users_menu) {

    private lateinit var myView: View

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        myView = view
        MyFragmentManager(requireActivity()).hideBackButton()
        getAllUsers()
    }

    private fun getAllUsers() {
        myView.findViewById<TextView>(R.id.loadingUsersText).visibility = View.VISIBLE

        UserRepository().getAllUser(UserService.getToken()).observe(viewLifecycleOwner, { it ->
            // some error occurred during HTTP request
            if (it.isError as Boolean) {
                CommonFun.printToast(requireContext(), it.message!!)
                return@observe
            }

            myView.findViewById<TextView>(R.id.loadingUsersText).visibility = View.GONE

            val users = it.data as ArrayList<UserModel.AllInfo>
            UserService.setAllUserInfo(users)
            val recyclerView = myView.findViewById<RecyclerView>(R.id.usersMenuRecyclerView)
            recyclerView.layoutManager = GridLayoutManager(requireContext(), Constants.NB_DATA_ROWS)

            val adapter = UserAdapterService.createAdapter(requireContext(), requireActivity(), R.layout.recycler_user_menu, R.id.usersMenuFrameLayout)
            recyclerView.adapter = adapter
            UserAdapterService.setAdapter(adapter)
        })
    }

}