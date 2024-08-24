import { NativeModules, Platform } from "react-native";

const LINKING_ERROR =
  "The package 'react-native-geolocation-state' doesn't seem to be linked. Make sure: \n\n" +
  Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
  "- You rebuilt the app after installing the package\n" +
  "- You are not using Expo Go\n";

const GeolocationState = NativeModules.GeolocationState
    ? NativeModules.GeolocationState
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        }
    );

export async function multiply(a: number, b: number): Promise<number> {
    return GeolocationState.multiply(a, b);
}
