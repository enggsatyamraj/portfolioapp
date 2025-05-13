import { WebView } from 'react-native-webview';
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
    return (
        <SafeAreaView style={styles.container}>
            <WebView
                style={styles.webview}
                source={{ uri: 'https://enggsatyamraj.vercel.app/' }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    webview: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});