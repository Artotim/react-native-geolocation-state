import {AppState, type NativeEventSubscription, Platform} from "react-native";
import {isEqual} from "lodash";

import {eventEmitter, GeolocationStateModule} from "./nativeManager";
import {type GeolocationState} from "./index";


type Listener = (state: GeolocationState) => void;


class GeolocationStateManager {
    /**
     * A singleton class that manages the geolocation state for the entire application.
     *
     * The `GeolocationStateManager` is designed to centralize the handling of geolocation state changes,
     * ensuring that all components using geolocation data are consistently updated without the overhead
     * of multiple listeners. By maintaining a single instance, the class efficiently manages event
     * subscriptions and state updates, providing a streamlined interface for accessing and reacting to
     * changes in geolocation state.
     *
     * Key Features:
     * - **Singleton Pattern:** Ensures only one instance of the class is created, preventing redundant listeners.
     * - **Centralized State Management:** Keeps track of the current geolocation state and updates all registered listeners when changes occur.
     * - **Cross-Platform Support:** Integrates with native modules to listen for geolocation state changes on both Android and iOS.
     * - **Automatic App State Handling:** Automatically refreshes the geolocation state when the app becomes active.
     *
     * @class GeolocationStateManager
     * @example
     * // Add a listener to be notified of state changes
     * GeolocationStateManager.addListener(newState => console.log(newState));
     *
     * // Get the current geolocation state
     * const state = GeolocationStateManager.getState();
     */

    private static instance: GeolocationStateManager | undefined;
    private eventSubscription: any = null;
    private appStateSubscription: NativeEventSubscription | null = null;
    private listeners: Listener[] = [];
    private geolocationState: GeolocationState = {
        permission: "notAuthorized",
        permissionType: "notAuthorized",
        gpsProvider: "disabled",
        networkProvider: null,
    };

    private constructor() {
        this.startListening();
    }

    /**
     * Gets the singleton instance of `GeolocationStateManager`.
     * @returns {GeolocationStateManager} The singleton instance.
     */
    public static getInstance(): GeolocationStateManager {

        if (!GeolocationStateManager.instance) {
            GeolocationStateManager.instance = new GeolocationStateManager();
        }
        return GeolocationStateManager.instance;
    }

    /**
     * Starts listening for geolocation state changes and app state changes.
     */
    private startListening(): void {

        this.eventSubscription = eventEmitter.addListener("providerStateChanged", this.handleIncomingGeolocationState);
        this.appStateSubscription = AppState.addEventListener("change", this.handleAppStateChange);

        if (Platform.OS === "android") {
            GeolocationStateModule.startListening();
        }
        this.updateState().catch(err => console.error(err));
    }

    /**
     * Stops listening for geolocation state changes and app state changes.
     */
    public stopListening(): void {

        this.eventSubscription?.remove();
        this.appStateSubscription?.remove();

        if (Platform.OS === "android") {
            GeolocationStateModule.stopListening();
        }
    }

    /**
     * Handles incoming geolocation state changes and notifies all listeners.
     * @param {GeolocationState} event The new geolocation state.
     */
    private readonly handleIncomingGeolocationState = (event: GeolocationState): void => {

        if (!isEqual(this.geolocationState, event)) {
            this.geolocationState = event;
            this.listeners.forEach(listener => listener(this.geolocationState));
        }
    };

    /**
     * Handles app state changes and updates the geolocation state if the app becomes active.
     * @param {string} nextAppState The new app state.
     */
    private readonly handleAppStateChange = (nextAppState: string): void => {
        if (nextAppState === "active") {
            this.updateState().catch(err => console.error(err));
        }
    };

    /**
     * Updates the geolocation state by fetching the latest data from the native module.
     */
    public updateState = async (): Promise<void> => {
        const stateResponse: GeolocationState = await GeolocationStateModule.getGeolocationState();
        this.handleIncomingGeolocationState(stateResponse);
    };

    /**
     * Retrieves the current geolocation state.
     * @returns {GeolocationState} The current state.
     */
    get currentState(): GeolocationState {
        return this.geolocationState;
    }

    /**
     * Adds a listener to be notified of state changes.
     * @param {Listener} listener The function to call when the state changes.
     */
    public addListener(listener: Listener): void {
        this.listeners.push(listener);
        listener(this.geolocationState);
    }

    /**
     * Removes a previously added listener.
     * @param {Listener} listener The function to remove.
     */
    public removeListener(listener: Listener): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
}


export default GeolocationStateManager.getInstance();
