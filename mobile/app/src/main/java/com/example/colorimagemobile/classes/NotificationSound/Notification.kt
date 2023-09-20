package com.example.colorimagemobile.classes.NotificationSound

import android.content.Context
import android.media.RingtoneManager

class Notification {

    fun playSound(context: Context){
        try{
            val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val r = RingtoneManager.getRingtone(context, defaultSoundUri)
            r.play()
        } catch (e: Exception){e.printStackTrace()}
    }
}