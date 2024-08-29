import GeolocationStateManager from "./GeolocationStateManager";


export type GeolocationState = {
    /**
     * Represents the current location permission status.
     * - "authorizedWhenInUse": The app is authorized to access location when in use.
     * - "authorizedAlways": The app is authorized to access location always.
     * - "notAuthorized": The app is not authorized to access location.
     */
    permission: "authorizedWhenInUse" | "authorizedAlways" | "notAuthorized";

    /**
     * Indicates the type of location permission granted.
     * - "fine": Fine location permission.
     * - "coarse": Coarse location permission.
     * - "notAuthorized": No location permission granted.
     */
    permissionType: "fine" | "coarse" | "notAuthorized";

    /**
     * Represents the state of the GPS provider.
     * - "enabled": GPS provider is enabled.
     * - "disabled": GPS provider is disabled.
     */
    gpsProvider: "enabled" | "disabled";

    /**
     * Represents the state of the network provider (Android only).
     * - "enabled": Network provider is enabled.
     * - "disabled": Network provider is disabled.
     * - undefined: Network provider state is not available.
     */
    networkProvider: "enabled" | "disabled" | undefined;
};

/**
 * Hook that provides the current geolocation state and updates it
 * whenever there is a change. It subscribes to geolocation state manager
 * and triggers re-renders when the state changes.
 *
 * @returns {GeolocationState} The current geolocation state.
 */
export {default as useGeolocationState} from "./useGeolocationState";

/**
 * Forces a refresh of the geolocation state.
 *
 * This method is a fallback and should be used only in cases where the library fails to
 * automatically detect state changes. It manually triggers an update of the geolocation
 * state by fetching the latest data from the native module.
 *
 * @returns {Promise<void>} A promise that resolves when the state has been updated.
 */
export const forceStateRefresh = async (): Promise<void> => {
    await GeolocationStateManager.updateState();
};
