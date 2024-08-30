import {DeviceEventEmitter, NativeEventEmitter, type NativeModule, NativeModules, Platform} from "react-native";


const LINKING_ERROR =
    "The package 'react-native-geolocation-state' doesn't seem to be linked. Make sure: \n\n" +
    Platform.select({ios: "- You have run 'pod install'\n", default: ""}) +
    "- You rebuilt the app after installing the package\n" +
    "- You are not using Expo Go\n";


export const GeolocationStateModule = NativeModules.GeolocationState
    ? NativeModules.GeolocationState
    : new Proxy(
        {},
        {
            get() {
                throw new Error(LINKING_ERROR);
            },
        },
    );


export const eventEmitter = Platform.OS === "ios"
    ? new NativeEventEmitter(NativeModules.RNEventEmitter as NativeModule)
    : DeviceEventEmitter;
