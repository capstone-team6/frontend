package com.time

import android.content.pm.PackageManager
import android.content.pm.PackageInfo
import android.util.Base64
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import java.security.MessageDigest
import java.security.NoSuchAlgorithmException
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate



class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "time"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
      super.onCreate(savedInstanceState)
      //setContentView(R.layout.activity_main);

      getHashKey()
  }

  private fun getHashKey() {
      var packageInfo: PackageInfo? = null
      try {
          packageInfo = packageManager.getPackageInfo(packageName, PackageManager.GET_SIGNATURES)
      } catch (e: PackageManager.NameNotFoundException) {
          e.printStackTrace()
      }
      if (packageInfo == null) {
          Log.e("KeyHash", "KeyHash:null")
      }

      packageInfo?.signatures?.forEach { signature ->
          try {
              val md = MessageDigest.getInstance("SHA")
              md.update(signature.toByteArray())
              Log.d("KeyHash", Base64.encodeToString(md.digest(), Base64.DEFAULT))
          } catch (e: NoSuchAlgorithmException) {
              Log.e("KeyHash", "Unable to get MessageDigest. signature=$signature", e)
          }
      }
  }
}


