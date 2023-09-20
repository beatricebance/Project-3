package com.example.colorimagemobile

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.colorimagemobile.databinding.ActivityMainBinding
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.repositories.UserRepository
import com.example.colorimagemobile.services.SharedPreferencesService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.ui.home.HomeActivity
import com.example.colorimagemobile.ui.login.LoginActivity
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.CommonFun.Companion.redirectTo
import com.example.colorimagemobile.utils.Constants

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var sharedPreferencesService: SharedPreferencesService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        sharedPreferencesService = SharedPreferencesService(this)
        val token = sharedPreferencesService.getItem(Constants.STORAGE_KEY.TOKEN)
        // if token exists, go to Home else go to Login for auth verification
        if (token.isNullOrEmpty()) {
            redirectTo(this, LoginActivity::class.java)
        } else {
            UserRepository().getUserByToken(token).observe(this, {
                if (it.isError!!) {
                    printToast(this@MainActivity, it.message!!)
                    redirectTo(this, LoginActivity::class.java)
                }

                UserService.setToken(token)
                UserService.setUserInfo(it.data?.user as UserModel.AllInfo)
                redirectTo(this, HomeActivity::class.java)
            })
        }
    }
}