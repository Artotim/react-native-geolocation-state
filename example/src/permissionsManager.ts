import {Platform} from "react-native";

import {check, openSettings, PERMISSIONS, request, RESULTS} from "react-native-permissions";


export const checkLocationPermissions = async (): Promise<boolean> => {

    if (Platform.OS === "android") {
        const granted = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        return granted === RESULTS.GRANTED;

    } else if (Platform.OS === "ios") {
        const granted = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return granted === RESULTS.GRANTED;

    } else {
        return false;
    }
};

export const requestLocationPermissions = async (): Promise<boolean> => {

    try {

        if (Platform.OS === "android") {
            const granted = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            return granted === RESULTS.GRANTED;

        } else if (Platform.OS === "ios") {
            const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            return granted === RESULTS.GRANTED;

        } else {
            return false;
        }

    } catch (err: any) {
        console.error("Location permissions error", err);
        return false;
    }
};

export const openPermissionsSettings = (): void => {
    openSettings().catch(() => console.warn("Failed to open App settings"));
};
