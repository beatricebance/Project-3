package com.example.colorimagemobile.ui.register

import android.annotation.SuppressLint
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.animation.AnimationUtils
import androidx.annotation.RequiresApi
import androidx.core.widget.doOnTextChanged
import androidx.lifecycle.ViewModelProvider
import com.example.colorimagemobile.R
import com.example.colorimagemobile.classes.FormValidator
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.databinding.ActivityRegisterBinding
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.HTTPResponseModel
import com.example.colorimagemobile.services.SharedPreferencesService
import com.example.colorimagemobile.ui.home.HomeActivity
import com.example.colorimagemobile.ui.login.LoginActivity
import com.example.colorimagemobile.utils.CommonFun.Companion.hideKeyboard
import com.example.colorimagemobile.utils.CommonFun.Companion.printToast
import com.example.colorimagemobile.utils.CommonFun.Companion.redirectTo
import com.example.colorimagemobile.utils.Constants
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import kotlinx.android.synthetic.main.activity_register.*
import java.time.LocalDateTime

enum class FormIndexes(val index: Int) {
    FIRST_NAME(0),
    LAST_NAME(1),
    USERNAME(2),
    EMAIL(3),
    PASSWORD(4),
    PASSWORD_CONFIRMATION(5)
}

class RegisterActivity : AppCompatActivity() {
    private lateinit var registerViewModel: RegisterActivityViewModel
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var sharedPreferencesService: SharedPreferencesService
    private lateinit var formValidator: FormValidator
    private var canSubmit: Boolean = false
    private lateinit var registerLayouts: ArrayList<TextInputLayout>
    private lateinit var registerInputs: ArrayList<TextInputEditText>


    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        registerViewModel = ViewModelProvider(this).get(RegisterActivityViewModel::class.java)
        sharedPreferencesService = SharedPreferencesService(this)

        registerLayouts = arrayListOf<TextInputLayout>(binding.firstNameInputLayout, binding.lastNameInputLayout, binding.usernameInputLayout, binding.emailInputLayout, binding.passwordInputLayout, binding.confirmPasswordInputLayout)
        registerInputs = arrayListOf<TextInputEditText>(binding.firstNameInputText, binding.lastNameInputText, binding.usernameInputText, binding.emailInputText, binding.passwordInputText, binding.confirmPasswordInputText)
        formValidator = FormValidator(registerLayouts, registerInputs)

        setListeners()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    @SuppressLint("ClickableViewAccessibility")
    private fun setListeners() {
        binding.loginText.setOnClickListener { redirectTo(this, LoginActivity::class.java) }
        binding.registerMain.setOnTouchListener { v, event -> hideKeyboard(this,binding.registerMain) }
        binding.registerBtn.setOnClickListener { executeRegister() }

        // add text listener to each input
        registerInputs.forEachIndexed { index, input ->
            input.doOnTextChanged { text, start, before, count ->
                handleInputError(text, registerLayouts[index])
            }
        }
    }

    private fun handleInputError(text: CharSequence?, inputLayout: TextInputLayout) {
        inputLayout.error = formValidator.getWhitespaceText(text)

        formValidator.validateEmail(FormIndexes.EMAIL.index)
        val containsError = formValidator.containsError()
        val invalidInputLength = formValidator.isInputEmpty(resources.getString(R.string.required))

        // activate/deactivate login button if form contains error or one of the inputs is empty
        canSubmit = !containsError && !invalidInputLength

    }

    private fun doPasswordsMatch(): Boolean {
        val unmatchedPasswordsText = "Passwords did not match"
        val password = getInputText(FormIndexes.PASSWORD.index)
        val passwordConfirmation = getInputText(FormIndexes.PASSWORD_CONFIRMATION.index)

        if (password != passwordConfirmation) {
            registerLayouts[FormIndexes.PASSWORD.index].error = unmatchedPasswordsText
            registerLayouts[FormIndexes.PASSWORD_CONFIRMATION.index].error = unmatchedPasswordsText
            return false
        }

        return true
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun executeRegister() {
        registerInputs.forEachIndexed {
                index,input -> handleInputError( input.text, registerLayouts[index])
        }
        if (!canSubmit || !doPasswordsMatch()) {
            val shake = AnimationUtils.loadAnimation(getApplicationContext(), R.anim.shake)
            registerForm.startAnimation(shake);
            return
        }

        // get input texts
        val firstName = getInputText(FormIndexes.FIRST_NAME.index)
        val lastName = getInputText(FormIndexes.LAST_NAME.index)
        val username = getInputText(FormIndexes.USERNAME.index)
        val email = getInputText(FormIndexes.EMAIL.index)
        val password = getInputText(FormIndexes.PASSWORD.index)
        val createdAt = LocalDateTime.now()

        // form body to make HTTP request
        val newUserData = UserModel.Register(firstName, lastName, username, email, password, createdAt.toString())
        val registerObserver = registerViewModel.registerUser(newUserData)
        registerObserver.observe(this, { handleRegisterResponse(it) })
    }

    // returns the text of an input depending on the field index
    private fun getInputText(index: Int): String {
        return registerInputs[index].text.toString()
    }

    private fun handleRegisterResponse(HTTPResponse: DataWrapper<HTTPResponseModel.RegisterResponse>) {
        // some error occurred during HTTP request
        if (HTTPResponse.isError as Boolean) {
            printToast(applicationContext, HTTPResponse.message as String)
            return
        }

        // account created successfully
        val response = HTTPResponse.data as HTTPResponseModel.RegisterResponse
        printToast(applicationContext, response.info)

        // save users info and token and redirect to /Home
        UserService.setToken(response.token)
        UserService.setUserInfo(response.user)
        sharedPreferencesService.setItem(Constants.STORAGE_KEY.TOKEN, response.token)
        redirectTo(this@RegisterActivity, HomeActivity::class.java)
    }
}