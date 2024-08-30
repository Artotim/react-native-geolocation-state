import {useEffect, useState} from "react";

import GeolocationStateManager from "./GeolocationStateManager";
import {type GeolocationState} from "./index";


export default function useGeolocationState(): GeolocationState {
    /**
     * A React hook that provides real-time updates on the device's geolocation state, ensuring the component
     * stays in sync with changes detected by the underlying geolocation manager.
     *
     * This hook subscribes to the geolocation state updates managed by `GeolocationStateManager` and
     * automatically updates the component when the state changes, leveraging React's state management.
     *
     * @returns {GeolocationState} The current geolocation state, including permission status, permission type, GPS, and network provider states.
     */

    const [state, setState] = useState<GeolocationState>(GeolocationStateManager.currentState);

    useEffect(() => {

        const handleStateChange = (newState: GeolocationState): void => {
            setState(newState);
        };

        GeolocationStateManager.addListener(handleStateChange);

        return () => {
            GeolocationStateManager.removeListener(handleStateChange);
        };
    }, []);

    return state;
};
