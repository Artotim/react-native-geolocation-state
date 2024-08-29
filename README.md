# react-native-geolocation-state

A library for React Native that provides a hook to monitor the geolocation.
It allows you to check the geolocation permission status and whether GPS and network providers are enabled or not without having to access the user's current location.

## Output
![Output example](output_example.gif)
## Installation

```sh
npm install react-native-geolocation-state
--- or ---
yarn add react-native-geolocation-state
```


## Geolocation State

The hook returns a `GeolocationState` object that describes the current state of geolocation in the app, featuring:

| Key               | Values                                                           | Description                                                                   |
|-------------------|------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `permission`      | `"authorizedWhenInUse"`, `"authorizedAlways"`, `"notAuthorized"` | Indicates the location permission status.                                     |
| `permissionType`  | `"fine"`, `"coarse"`, `"notAuthorized"`                          | Specifies the type of location permission granted.                            |
| `gpsProvider`     | `"enabled"`, `"disabled"`                                        | Shows whether the GPS provider is enabled or disabled.                        |
| `networkProvider` | `"enabled"`, `"disabled"`, `undefined`                           | Shows whether the network provider is enabled or disabled (**Android only**). |


## Usage

### useGeolocationState

A hook that provides access to the current geolocation state. It automatically updates when the geolocation state changes.

#### Example

```typescript
import { useGeolocationState } from 'react-native-geolocation-state';

const TestComponent = () => {
    
    const geolocationState = useGeolocationState();

    useEffect(() => {
        console.log("Geolocation state updated. New state:", geolocationState);
    }, [geolocationState]);
};
```

### forceStateRefresh

The `forceStateRefresh` method manually triggers an update of the geolocation state by fetching the latest data from the native module.
This method is a fallback and should be used only in cases where the library fails to automatically detect state changes.


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
