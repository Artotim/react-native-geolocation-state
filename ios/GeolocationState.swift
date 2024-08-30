import CoreLocation

@objc(GeolocationState)
class GeolocationState: NSObject, CLLocationManagerDelegate {

    // Variables
    private let locationManager = CLLocationManager()

    // Lifecycle Methods
    override init() {
        super.init()
        locationManager.delegate = self
    }

    // Listen to events
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        let geolocationState = self.getGeolocationStateParams(status: status)
        if RNEventEmitter.hasListeners {
            RNEventEmitter.emitter.sendEvent(withName: "providerStateChanged", body: geolocationState)
        }
    }

    // Check state params
    private func getGeolocationStateParams(status: CLAuthorizationStatus) -> [String: String?] {

        var params: [String: String?] = [:]

        let (permission, permissionType) = getPermissionState(status: status)
        let gpsEnabled = isGpsEnabled() ? "enabled" : "disabled"

        params["permission"] = permission
        params["permissionType"] = permissionType
        params["gpsProvider"] = gpsEnabled
        params["networkProvider"] = nil as String?

        return params
    }

    private func getPermissionState(status: CLAuthorizationStatus) -> (String, String) {

        let permissionState: String
        switch status {
        case .authorizedWhenInUse:
            permissionState = "authorizedWhenInUse"
        case .authorizedAlways:
            permissionState = "authorizedAlways"
        case .denied:
            permissionState = "denied"
        default:
            permissionState = "notAuthorized"
        }

        let permissionType: String
        if permissionState == "authorizedWhenInUse" || permissionState == "authorizedAlways" {
            if #available(iOS 14.0, *) {
                switch locationManager.accuracyAuthorization {
                case .fullAccuracy:
                    permissionType = "fine"
                case .reducedAccuracy:
                    permissionType = "coarse"
                @unknown default:
                    permissionType = "notAuthorized"
                }
            } else {
                permissionType = "fine"
            }
        } else {
            permissionType = "notAuthorized"
        }

        return (permissionState, permissionType)
    }

    private func isGpsEnabled() -> Bool {
        return CLLocationManager.locationServicesEnabled()
    }

    // Get state
    @objc
    func getGeolocationState(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {

        let status: CLAuthorizationStatus

        if #available(iOS 14, *) {
            status = locationManager.authorizationStatus
        } else {
            status = CLLocationManager.authorizationStatus()
        }
        resolve(getGeolocationStateParams(status: status))
    }
}
