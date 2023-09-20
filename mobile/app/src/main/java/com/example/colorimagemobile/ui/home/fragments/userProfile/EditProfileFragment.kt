package com.example.colorimagemobile.ui.userProfile

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LiveData
import com.example.colorimagemobile.R
import com.example.colorimagemobile.bottomsheets.DefaultAvatarListBottomSheet
import com.example.colorimagemobile.classes.MyPicasso
import com.example.colorimagemobile.models.DataWrapper
import com.example.colorimagemobile.models.HTTPResponseModel
import com.example.colorimagemobile.models.UserModel
import com.example.colorimagemobile.httpresponsehandler.GlobalHandler
import com.example.colorimagemobile.models.AvatarModel
import com.example.colorimagemobile.repositories.AvatarRepository
import com.example.colorimagemobile.repositories.UserRepository
import com.example.colorimagemobile.services.SharedPreferencesService
import com.example.colorimagemobile.services.avatar.AvatarService
import com.example.colorimagemobile.services.users.UserService
import com.example.colorimagemobile.utils.CommonFun
import com.example.colorimagemobile.utils.CommonFun.Companion.imageView
import com.example.colorimagemobile.utils.Constants
import com.example.colorimagemobile.utils.Constants.Companion.CAMERA_REQUEST_CODE
import com.karumi.dexter.Dexter
import com.karumi.dexter.MultiplePermissionsReport
import com.karumi.dexter.PermissionToken
import com.karumi.dexter.listener.PermissionRequest
import com.karumi.dexter.listener.multi.MultiplePermissionsListener
import kotlinx.android.synthetic.main.fragment_edit_profile.*
import kotlinx.android.synthetic.main.fragment_password.*
import kotlinx.android.synthetic.main.fragment_show_user_profile.*
import java.io.File
import java.io.ByteArrayOutputStream
import java.io.FileOutputStream
import java.lang.Exception
import java.time.LocalDateTime


class EditProfileFragment : Fragment() {

    private lateinit var sharedPreferencesService: SharedPreferencesService
    private lateinit var avatarRepository : AvatarRepository
    private lateinit var edtDescription: String
    private lateinit var infDescription: TextView
    private lateinit var edtUsername: String
    private lateinit var globalHandler: GlobalHandler
    private lateinit var infName: TextView
    private lateinit var token : String
    private lateinit var user : UserModel.AllInfo
    private lateinit var currentAvatar : AvatarModel.AllInfo
    private lateinit var newUserData : UserModel.UpdateUser
    private var infview : View ? = null
    private lateinit var bitmap: Bitmap
    private  var file : File? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        user = UserService.getUserInfo()
        avatarRepository = AvatarRepository()
        globalHandler = GlobalHandler()
        sharedPreferencesService = context?.let { SharedPreferencesService(it) }!!
        token = sharedPreferencesService.getItem(Constants.STORAGE_KEY.TOKEN)
        newUserData =UserModel.UpdateUser(null,null,null)

    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        // inflate layout
        val inf = inflater.inflate(R.layout.fragment_edit_profile, container, false)

        // listeners
        inf.findViewById<View>(R.id.updateprofile).setOnClickListener { update() }
        inf.findViewById<View>(R.id.upload_avatar_from_camera).setOnClickListener {
            cameraCheckPermission() }
        inf.findViewById<View>(R.id.editprofileview).setOnTouchListener { v, event -> CommonFun.hideKeyboard(requireContext(), editprofileview)}
        inf.findViewById<View>(R.id.choosedefaultavatar).setOnClickListener {
            val defaultAvatarList = DefaultAvatarListBottomSheet()
            defaultAvatarList.show(parentFragmentManager, "DefaultAvatarListBottomSheetDialog")
        }

        imageView = (inf.findViewById<View>(R.id.current_avatar) as ImageView)
        MyPicasso().loadImage(user.avatar.imageUrl, imageView )
        infview = inf
        return inf
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        getAllAvatar()

    }

    // Get all default avatar from database
    private fun getAllAvatar(){
        AvatarRepository().getAllAvatar().observe(context as LifecycleOwner,{
            if (it.isError as Boolean) {
                return@observe
            }
            val avatars = it.data as ArrayList<AvatarModel.AllInfo>
            AvatarService.setAvatars(avatars)
        })
    }

    //Verify if field are empty and set username and description on change
    private fun areFieldEmpty(){
        infName = (infview!!.findViewById<View>(R.id.edtusername) as TextView)
        infDescription = (infview!!.findViewById<View>(R.id.edtdescription) as TextView)
        edtUsername = infName.text.toString()
        edtDescription = infDescription.text.toString()
        if (edtUsername.length != 0 ){
            newUserData.username = edtUsername
        }
        if (edtDescription.length != 0){
            newUserData.description = edtDescription
        }

    }

    // set the data to be update
    private fun setDataToUpdate(){
        if(AvatarService.getCurrentAvatar().imageUrl!= Constants.EMPTY_STRING){
            currentAvatar = AvatarService.getCurrentAvatar()
            newUserData.avatar = currentAvatar
            UserService.setUserAvatar(currentAvatar)
        }

    }

    // update profile with the data enter
    private fun update(){
        var countExistingAvatar : Int = 0
        for(indices in AvatarService.getAvatars().indices){
            if (AvatarService.getCurrentAvatar() != AvatarService.getAvatars()[indices]){
                countExistingAvatar++
            }
        }
        if (countExistingAvatar == 0){
            postAvatar(AvatarService.getCurrentAvatar()).observe(viewLifecycleOwner, { handleResponse(it) })
        }

        setDataToUpdate()
        areFieldEmpty()
        UserService.setNewProfileData(newUserData)

        // update user
        updateUserInfo().observe(viewLifecycleOwner, { context?.let { it1 ->globalHandler.response(it1,it) } })

        //clear all field
        clearTextField()

        // update local user data
        UserService.updateUserAfterUpdate(UserService.getNewProfileData())

        // update menu item
        requireActivity().invalidateOptionsMenu()
    }



    //call retrofit request to database to update user info
    private fun updateUserInfo(): LiveData<DataWrapper<HTTPResponseModel.UserResponse>> {
        return UserRepository().updateUserData(token, user._id)
    }

    //call retrofit request to upload image and get imageUrl from amazon S3
    private fun uploadAvatar(file: File):LiveData<DataWrapper<AvatarModel.AllInfo>> {
        return AvatarRepository().uploadAvatar(file)
    }

    //call retrofit request to database to post the image to the avatar collection
    private fun postAvatar(avatar: AvatarModel.AllInfo):LiveData<DataWrapper<AvatarModel.AllInfo>>{
        return AvatarRepository().postAvatar(avatar)
    }

    // handler for response postAvatar  and uploadAvatar
    private fun handleResponse(HTTPResponse: DataWrapper<AvatarModel.AllInfo>) {
        if (HTTPResponse.isError as Boolean) {
            CommonFun.printToast(requireContext(), HTTPResponse.message as String)
            return
        }
        CommonFun.printToast(requireContext(), HTTPResponse.message!!)

    }
    private fun clearTextField(){
        infName.setText("");
        infDescription.setText("");
    }

    // function to convert bitmap to file
    fun bitmapToFile(bitmap: Bitmap, fileNameToSave: String): File? {
        return try {
            file = File(Environment.getExternalStorageDirectory().toString()+File.separator+fileNameToSave)
            file!!.createNewFile()

            //Convert bitmap to byte array
            val bos = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 0, bos)
            val bitmapData = bos.toByteArray()
            //write the bytes in file
            val fos = FileOutputStream(file)
            fos.write(bitmapData)
            fos.flush()
            fos.close()
            file
        } catch (e: Exception) {
            e.printStackTrace()
            file
        }
    }

    // check for camera permission
    private fun cameraCheckPermission() {

        Dexter.withContext(requireContext())
            .withPermissions(
                android.Manifest.permission.READ_EXTERNAL_STORAGE,
                android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
                android.Manifest.permission.CAMERA).withListener(

                object : MultiplePermissionsListener {
                    override fun onPermissionsChecked(report: MultiplePermissionsReport?) {
                        report?.let {

                            if (report.areAllPermissionsGranted()) {
                                val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
                                startActivityForResult(intent, CAMERA_REQUEST_CODE)
                            }
                        }
                    }
                    override fun onPermissionRationaleShouldBeShown(
                        p0: MutableList<PermissionRequest>?,
                        p1: PermissionToken?) {
                    }
                }
            ).onSameThread().check()
    }

    // call whenever we try to take a picture
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == 1 && data != null) {
            bitmap = data.extras?.get("data") as Bitmap
            imageView.setImageBitmap(bitmap)
            val fileToUpload: File? =
                bitmapToFile(bitmap, user.username.take(4)+LocalDateTime.now().toString()+Constants.PNG)
            uploadAvatar(fileToUpload!!).observe(viewLifecycleOwner, { handleResponse(it) })
        }
    }

}
