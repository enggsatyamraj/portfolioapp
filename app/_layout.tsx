import React from 'react';
import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'white' }
                }}
            />
        </SafeAreaProvider>
    );
}