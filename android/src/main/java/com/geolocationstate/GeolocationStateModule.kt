package com.geolocationstate

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.location.LocationManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule

@ReactModule(name = GeolocationStateModule.NAME)
class GeolocationStateModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Companion Object
    companion object {
        const val NAME = "GeolocationState"
    }

    // Variables
    private val reactContext: ReactApplicationContext = reactContext
    private var locationSwitchStateReceiver: BroadcastReceiver? = null
    private var previousGeolocationState = getGeolocationStateParams()

    // Lifecycle Methods
    override fun getName(): String {
        return NAME
    }

    // Private Methods
    // Check state params
    private fun getGeolocationStateParams(): WritableMap {

        val params = Arguments.createMap()

        val (permission, permissionType) = getPermissionState(reactContext)
        val gpsEnabled = if (isGpsEnabled()) "enabled" else "disabled"
        val networkEnabled = if (isNetworkEnabled()) "enabled" else "disabled"

        params.putString("permission", permission)
        params.putString("permissionType", permissionType)
        params.putString("gpsProvider", gpsEnabled)
        params.putString("networkProvider", networkEnabled)

        return params
    }

    private fun getPermissionState(context: Context): Pair<String, String> {
        val fineLocationPermission = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION)
        val coarseLocationPermission = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_COARSE_LOCATION)
        val backgroundLocationPermission = ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_BACKGROUND_LOCATION)

        val hasFineLocationPermission = fineLocationPermission == PackageManager.PERMISSION_GRANTED
        val hasCoarseLocationPermission = coarseLocationPermission == PackageManager.PERMISSION_GRANTED

        val permissionState = when {
            backgroundLocationPermission == PackageManager.PERMISSION_GRANTED -> "authorizedAlways"
            hasFineLocationPermission || hasCoarseLocationPermission -> "authorizedWhenInUse"
            else -> "notAuthorized"
        }

        val permissionType = when {
            hasFineLocationPermission -> "fine"
            hasCoarseLocationPermission -> "coarse"
            else -> "notAuthorized"
        }

        return Pair(permissionState, permissionType)
    }

    private fun isGpsEnabled(): Boolean {
        val locationManager = reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
    }

    private fun isNetworkEnabled(): Boolean {
        val locationManager = reactContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        return locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)
    }

    // Listen to events
    private fun createLocationSwitchStateReceiver(): BroadcastReceiver {
        return object : BroadcastReceiver() {
            override fun onReceive(context: Context, intent: Intent) {
                if (LocationManager.PROVIDERS_CHANGED_ACTION == intent.action) {
                    val geolocationState = getGeolocationStateParams()

                    if (hasStateChanged(geolocationState, previousGeolocationState)) {
                        previousGeolocationState = geolocationState
                        sendEvent("providerStateChanged", geolocationState)
                    }
                }
            }
        }
    }

    private fun hasStateChanged(currentState: WritableMap, previousState: WritableMap): Boolean {
        val currentMap = currentState.toHashMap().mapValues { it.value.toString() }
        val previousMap = previousState?.toHashMap()?.mapValues { it.value.toString() }

        return currentMap != previousMap
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Public Methods
    // Configure listening
    @ReactMethod
    fun startListening(promise: Promise) {
        if (locationSwitchStateReceiver == null) {
            locationSwitchStateReceiver = createLocationSwitchStateReceiver()
        }
        val filter = IntentFilter(LocationManager.PROVIDERS_CHANGED_ACTION)
        filter.addAction(Intent.ACTION_PROVIDER_CHANGED)
        reactContext.registerReceiver(locationSwitchStateReceiver, filter)
        promise.resolve("success")
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        locationSwitchStateReceiver?.let {
            reactContext.unregisterReceiver(it)
            locationSwitchStateReceiver = null
            promise.resolve("success")
        } ?: run {
            promise.reject("RECEIVER_NOT_REGISTERED", "Location Switch State Receiver is not registered.")
        }
    }

    // Get state
    @ReactMethod
    fun getGeolocationState(promise: Promise) {
        promise.resolve(getGeolocationStateParams())
    }
}
