import {useState, useEffect, type ReactElement} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

import {useGeolocationState} from "react-native-geolocation-state";

import {openPermissionsSettings, requestLocationPermissions} from "./permissionsManager";


export default function App(): ReactElement {
    const [permissionGranted, setPermissionGranted] = useState(false);
    const geolocationState = useGeolocationState();

    useEffect(() => {
        console.log("Geolocation state updated. New state:", geolocationState);
        setPermissionGranted(geolocationState.permission !== "notAuthorized");
    }, [geolocationState]);

    const handleRequestPermission = async (): Promise<void> => {
        await requestLocationPermissions();
    };

    const renderGeolocationsState = (): ReactElement => {

        const {permission, permissionType, gpsProvider, networkProvider} = geolocationState;

        const hasPermission = permission === "authorizedWhenInUse" || permission === "authorizedAlways";

        return (
            <View style={styles.stateInfoContainer}>
                <Text style={styles.stateInfo}>Permission state: <Text style={[styles.stateValue, hasPermission ? styles.stateValueGreen : styles.stateValueRed]}>{permission}</Text></Text>
                <Text style={styles.stateInfo}>Permission type: <Text style={[styles.stateValue, permissionType === "notAuthorized" ? styles.stateValueRed : styles.stateValueGreen]}>{permissionType}</Text></Text>
                <Text style={styles.stateInfo}>GPS provider state: <Text style={[styles.stateValue, gpsProvider === "enabled" ? styles.stateValueGreen : styles.stateValueRed]}>{gpsProvider}</Text></Text>
                <Text style={styles.stateInfo}>Network provider state: <Text style={[styles.stateValue, networkProvider === "enabled" ? styles.stateValueGreen : styles.stateValueRed]}>{networkProvider ?? "null"}</Text></Text>
            </View>
        );
    };

    const renderPermissionButton = (): ReactElement => {

        if (permissionGranted) {
            return (
                <TouchableOpacity style={styles.button} onPress={openPermissionsSettings}>
                    <Text style={styles.buttonText}>Open permissions settings</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity style={styles.button} onPress={() => {
                    handleRequestPermission().catch(err => console.error(err));
                }}>
                    <Text style={styles.buttonText}>Grant location permissions</Text>
                </TouchableOpacity>
            );
        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>React Native Geolocation State</Text>

            {renderGeolocationsState()}

            {renderPermissionButton()}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 50,
        textAlign: "center",
        color: "#343a40",
    },
    stateInfoContainer: {
        marginBottom: 30,
    },
    stateInfo: {
        fontSize: 18,
        marginBottom: 10,
        color: "#495057",
    },
    stateValue: {
        fontWeight: "bold",
    },
    stateValueRed: {
        color: "#ff3333",
    },
    stateValueGreen: {
        color: "#009900",
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
