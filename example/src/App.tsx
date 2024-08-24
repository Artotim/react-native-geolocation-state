import { useState, useEffect, type ReactElement } from "react";
import { StyleSheet, View, Text } from "react-native";
import { multiply } from "react-native-geolocation-state";

export default function App(): ReactElement {
    const [result, setResult] = useState<number | undefined>();

    useEffect(() => {
        multiply(3, 7).then(setResult).catch(err => console.error(err));
    }, []);

    return (
        <View style={styles.container}>
            <Text>Result: {result}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20,
    },
});
