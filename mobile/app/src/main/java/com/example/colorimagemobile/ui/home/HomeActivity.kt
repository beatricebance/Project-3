package com.example.colorimagemobile.ui.home

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.view.View
import android.widget.ImageView
import android.widget.SearchView
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.example.colorimagemobile.ui.login.LoginActivity
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.MyFragmentManager
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.httpresponsehandler.GlobalHandler
import com.example.colorimagemobile.models.*
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.repositories.SearchRepository
import com.example.colorimagemobile.services.SearchService
import com.example.colorimagemobile.services.SharedPreferencesService
import com.example.colorimagemobile.services.drawing.DrawingObjectManager
import com.example.colorimagemobile.services.drawing.DrawingService
import com.example.colorimagemobile.services.socket.SocketManagerService
import com.example.colorimagemobile.ui.home.fragments.search.SearchFragment
import com.example.colorimagemobile.ui.home.fragments.chat.ChatFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.gallery.GalleryFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.museum.MuseumFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.teams.TeamsFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.userProfile.ShowUserProfileFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.userProfile.UserProfileFragmentDirections
import com.example.colorimagemobile.ui.home.fragments.users.UsersFragmentDirections
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.CommonFun.Companion.redirectTo
import com.example.colorimagemobile.utils.Constants
import com.google.android.material.bottomnavigation.BottomNavigationView
import kotlinx.android.synthetic.main.fragment_show_user_profile.*

class HomeActivity : AppCompatActivity() {
    private lateinit var homeViewModel: HomeActivityViewModel
    private lateinit var sharedPreferencesService: SharedPreferencesService
    private lateinit var globalHandler: GlobalHandler
    private lateinit var navController: NavController
    private lateinit var bottomNav: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        globalHandler = GlobalHandler()
        homeViewModel = ViewModelProvider(this).get(HomeActivityViewModel::class.java)
        sharedPreferencesService = SharedPreferencesService(this)

        navController = findNavController(R.id.fragment)
        bottomNav = findViewById<BottomNavigationView>(R.id.bottomNavigationView)

        setBottomNavigationView()
    }

    // side navigation navbar: upon click, change to new fragment
    private fun setBottomNavigationView() {
        // remove every socket events
        bottomNav.setOnItemSelectedListener {
            SocketManagerService.disconnectFromAll()
            return@setOnItemSelectedListener true
        }

        val appBarConfiguration = AppBarConfiguration(setOf(
            R.id.galleryFragment, R.id.chatFragment, R.id.teamsFragment, R.id.usersFragment, R.id.museumFragment))
        setupActionBarWithNavController(navController, appBarConfiguration)
        bottomNav.setupWithNavController(navController)
    }

    // add options to Home Navbar
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        val inflater = menuInflater
        inflater.inflate(R.menu.toolbar_actions_menu, menu)

        // username
        val usernameMenuItem: MenuItem = (menu as Menu).findItem(R.id.username_menu_item)
        usernameMenuItem.title = UserService.getUserInfo().username

        //avatar
        val avatarmenuItem : MenuItem = (menu as Menu).findItem(R.id.useravatar_menu_item)
        val view: View = avatarmenuItem.getActionView()
        val profileImage : ImageView = view.findViewById(R.id.toolbar_profile_avatar)
        MyPicasso().loadImage( UserService.getUserInfo().avatar.imageUrl, profileImage)

        setSearchIcon(menu)
        return true
    }

    private fun setSearchIcon(menu: Menu?) {
        val searchView = menu?.findItem(R.id.searchIcon)?.actionView as SearchView
        searchView.queryHint = "Quick Search"

        searchView.setOnCloseListener(object: SearchView.OnCloseListener {
            override fun onClose(): Boolean {
                bottomNav.selectedItemId = navController.currentDestination?.id!!
                return false
            }
        })

        searchView.setOnQueryTextListener(object: SearchView.OnQueryTextListener {
            override fun onQueryTextChange(newText: String): Boolean {
                if (newText.isNullOrEmpty()) { SearchService.clear() }
                return false
            }
            override fun onQueryTextSubmit(query: String): Boolean {
                SearchService.setQuery(query)
                searchView.clearFocus()
                getFilteredData()
                return true
            }
        })
    }

    // when clicked on individual menu icons
    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {

        R.id.log_out_menu_item -> {
            logUserOut()
            true
        }
        R.id.show_profile -> {
            showUserProfile()
            true
        }
        R.id.Settings -> {
            showSettings()
            true
        }
        else -> {
            super.onOptionsItemSelected(item)
        }
    }

    override fun onSupportNavigateUp(): Boolean {

         val navController = this.findNavController(R.id.fragment)
        return when(navController.currentDestination?.id) {
            // back button clicked on Gallery Drawing
            R.id.galleryFragment -> {
                saveDrawing()
                DrawingObjectManager.clearLayers()
                SocketManagerService.leaveDrawingRoom()
                DrawingService.setCurrentDrawingID(null)
                bottomNav.selectedItemId = R.id.galleryFragment
                true
            }
            R.id.teamsFragment -> {
                bottomNav.selectedItemId = R.id.teamsFragment
                true
            }
            R.id.chatFragment -> {
                bottomNav.selectedItemId = R.id.chatChannelFragment
                true
            }
            R.id.usersFragment -> {
                bottomNav.selectedItemId = R.id.usersFragment
                true
            }
            R.id.museumFragment -> {
                bottomNav.selectedItemId = R.id.museumFragment
                true
            }

            else -> navController.navigateUp()
        }
    }

    private fun saveDrawing() {
        val dataUri = DrawingObjectManager.getDrawingDataURI()

        val saveDrawing = DrawingModel.SaveDrawing(dataUri = dataUri)
        homeViewModel.saveDrawing(saveDrawing).observe(this, {
            if (it.isError!!) {
                printToast(this, it.message!!)
                return@observe
            }
        })
    }

    private fun logUserOut() {
        val user = UserModel.Logout(UserService.getUserInfo().username)
        val logOutObserver = homeViewModel.logoutUser(user)
        logOutObserver.observe(this, { handleLogOutResponse(it) })
    }

    private fun handleLogOutResponse(it: DataWrapper<HTTPResponseModel>) {
        printToast(applicationContext, it.message as String)

        // some error occurred during HTTP request
        if (it.isError as Boolean) {
            return
        }

        val token = sharedPreferencesService.getItem(Constants.STORAGE_KEY.TOKEN)
        UserService.setToken(token)

        // remove items from "local storage"
        sharedPreferencesService.removeItem(Constants.STORAGE_KEY.TOKEN)

        redirectTo(this, LoginActivity::class.java)
    }

    // menu item show user profile
    private fun showUserProfile(){
        // define path
        val showUserProfileFromGallery = GalleryFragmentDirections.actionGalleryFragmentToShowUserProfileFragment()
        val showUserProfileFromTeam = TeamsFragmentDirections.actionTeamsFragmentToShowUserProfileFragment()
        val showUserProfileFromChat = ChatFragmentDirections.actionChatFragmentToShowUserProfileFragment()
        val showUserProfileFromSettings = UserProfileFragmentDirections.actionUserProfileFragmentToShowUserProfileFragment()
        val showUserProfileFromPublicView = UsersFragmentDirections.actionUsersFragmentToShowUserProfileFragment()
        val showUserProfileFromMuseum = MuseumFragmentDirections.actionMuseumFragmentToShowUserProfileFragment()

        // redirect from actual page to userProfile
        when (this.findNavController(R.id.fragment).currentDestination?.id) {
            R.id.galleryFragment-> this.findNavController(R.id.fragment).navigate(showUserProfileFromGallery)
            R.id.teamsFragment  -> this.findNavController(R.id.fragment).navigate(showUserProfileFromTeam)
            R.id.chatFragment ->this.findNavController(R.id.fragment).navigate(showUserProfileFromChat)
            R.id.userProfileFragment ->this.findNavController(R.id.fragment).navigate(showUserProfileFromSettings)
            R.id.usersFragment ->this.findNavController(R.id.fragment).navigate(showUserProfileFromPublicView)
            R.id.museumFragment -> this.findNavController(R.id.fragment).navigate(showUserProfileFromMuseum)
        }
    }

    // menu item show settings
    private fun showSettings(){
        //define path
        val showSettingsFromGallery = GalleryFragmentDirections.actionGalleryFragmentToUserProfileFragment()
        val showSettingsFromTeam = TeamsFragmentDirections.actionTeamsFragmentToUserProfileFragment()
        val showSettingsFromChat = ChatFragmentDirections.actionChatFragmentToUserProfileFragment()
        val showSettingsFromProfileView = ShowUserProfileFragmentDirections.actionShowUserProfileFragmentToUserProfileFragment()
        val showSettingsFromPublicView = UsersFragmentDirections.actionUsersFragmentToUserProfileFragment()
        val showSettingsFromMuseum = MuseumFragmentDirections.actionMuseumFragmentToUserProfileFragment()

        // redirect from actual page to settings
        when (this.findNavController(R.id.fragment).currentDestination?.id) {
            R.id.galleryFragment-> this.findNavController(R.id.fragment).navigate(showSettingsFromGallery)
            R.id.teamsFragment  -> this.findNavController(R.id.fragment).navigate(showSettingsFromTeam)
            R.id.chatFragment ->this.findNavController(R.id.fragment).navigate(showSettingsFromChat)
            R.id.showUserProfileFragment -> this.findNavController(R.id.fragment).navigate(showSettingsFromProfileView)
            R.id.usersFragment -> this.findNavController(R.id.fragment).navigate(showSettingsFromPublicView)
            R.id.museumFragment -> this.findNavController(R.id.fragment).navigate(showSettingsFromMuseum)
        }
    }

    private fun getFilteredData() {
        val query = SearchService.getQuery()
        if (query.isNullOrEmpty()) return

        SearchRepository().getSearchQuery(query).observe(this, {
            if (it.isError as Boolean) { return@observe }

            val filteredData = it.data as SearchModel
            MyFragmentManager(this).openWithData(R.id.fragment, SearchFragment(), Constants.SEARCH.CURRENT_QUERY, filteredData)
        })
    }
}