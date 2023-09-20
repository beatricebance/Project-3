package com.example.colorimagemobile.ui.home.fragments.userProfile

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import com.example.colorimagemobile.R
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.models.UserModel
import android.widget.TextView
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.utils.CommonFun.Companion.imageView


class ShowUserProfileFragment : Fragment() {

    // get current user
    private lateinit var user : UserModel.AllInfo

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        user = UserService.getUserInfo()
    }


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // inflate layout
        val inf: View = inflater.inflate(R.layout.fragment_show_user_profile, container, false)

        // find the texView
        val username = inf.findViewById<View>(R.id.username) as TextView
        val firstname = inf.findViewById<View>(R.id.firstname) as TextView
        val lastname = inf.findViewById<View>(R.id.lastname) as TextView
        val description = inf.findViewById<View>(R.id.description) as TextView
        val email = inf.findViewById<View>(R.id.email) as TextView
        imageView = inf.findViewById<View>(R.id.avatar) as ImageView

        // sets the derived data
        description.text = user.description
        username.text = user.username
        firstname.text = user.firstName
        lastname.text = user.lastName
        email.text = user.email
        MyPicasso().loadImage(user.avatar.imageUrl,imageView)
        return inf
    }


}