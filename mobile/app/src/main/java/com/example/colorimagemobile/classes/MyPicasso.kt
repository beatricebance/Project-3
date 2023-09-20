package com.example.colorimagemobile.classes

import android.widget.ImageView
import com.squareup.picasso.Picasso

class MyPicasso {

    fun loadImage(url: String, imageView: ImageView) {
        Picasso.get().load(url).into(imageView);
    }
}