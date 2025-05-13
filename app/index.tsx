import { WebView } from 'react-native-webview';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Platform,
    BackHandler,
    TouchableOpacity,
    Linking
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    const [webViewError, setWebViewError] = useState(false);
    const webViewRef = useRef<WebView>(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [progress, setProgress] = useState(0);

    // Handle back button navigation within WebView on Android
    useEffect(() => {
        if (Platform.OS === 'android') {
            const backAction = () => {
                if (canGoBack && webViewRef.current) {
                    webViewRef.current.goBack();
                    return true;
                }
                return false;
            };

            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }
    }, [canGoBack]);

    // Check network connectivity
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected !== null ? state.isConnected : true);
        });

        return () => unsubscribe();
    }, []);

    // Handle retry when offline or error
    const handleRetry = () => {
        NetInfo.fetch().then(state => {
            setIsConnected(state.isConnected !== null ? state.isConnected : true);
            if (state.isConnected) {
                setWebViewError(false);
                if (webViewRef.current) {
                    webViewRef.current.reload();
                }
            }
        });
    };

    // Check if URL is external
    const isExternalLink = (url: string) => {
        return !url.includes('enggsatyamraj.vercel.app');
    };

    // Handle navigation state change and external links
    const handleNavigationStateChange = (navState: any) => {
        setCanGoBack(navState.canGoBack);

        // If it's an external link, open in device browser
        if (isExternalLink(navState.url)) {
            // Stop the WebView from loading the URL
            webViewRef.current?.stopLoading();

            // Open the URL in the device's browser
            Linking.openURL(navState.url);

            // Return to the portfolio
            if (webViewRef.current) {
                webViewRef.current.injectJavaScript(`
                    window.location.href = 'https://enggsatyamraj.vercel.app/';
                    true;
                `);
            }
        }
    };

    // Handle WebView error
    const handleWebViewError = () => {
        setWebViewError(true);
        setIsLoading(false);
    };

    // Handle WebView load end - ensure loading indicator is hidden
    const handleLoadEnd = () => {
        setIsLoading(false);
        // console.log("WebView fully loaded");
    };

    // Loading progress
    const renderLoadingView = () => {
        if (!isLoading) return null;

        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A60A1" />
                <Text style={styles.loadingText}>Loading portfolio...</Text>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
            </View>
        );
    };

    // Offline view
    const renderOfflineView = () => {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.errorTitle}>No Internet Connection</Text>
                <Text style={styles.errorMessage}>
                    Please check your internet connection and try again to view the portfolio.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry Connection</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Error view
    const renderErrorView = () => {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.errorTitle}>Unable to Load Website</Text>
                <Text style={styles.errorMessage}>
                    There was a problem loading the portfolio website. Please check your connection and try again.
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render appropriate view based on state
    if (!isConnected) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                {renderOfflineView()}
            </SafeAreaView>
        );
    }

    if (webViewError) {
        return (
            <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
                {renderErrorView()}
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <WebView
                ref={webViewRef}
                source={{ uri: 'https://enggsatyamraj.vercel.app/' }}
                style={styles.webview}
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={handleLoadEnd}
                onLoadProgress={({ nativeEvent }) => {
                    setProgress(nativeEvent.progress);
                    // If progress is 100%, ensure loading is false
                    if (nativeEvent.progress === 1) {
                        setIsLoading(false);
                    }
                }}
                onError={handleWebViewError}
                onHttpError={handleWebViewError}
                onNavigationStateChange={handleNavigationStateChange}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                cacheEnabled={true}
                pullToRefreshEnabled={true}
                // @ts-ignore
                renderLoading={() => null} // Don't use the default loader
            />
            {renderLoadingView()}
        </SafeAreaView>
    );
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
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 999,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4A60A1',
    },
    progressBarContainer: {
        height: 4,
        width: 200,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginTop: 16,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4A60A1',
    },
    progressText: {
        marginTop: 6,
        fontSize: 12,
        color: '#6B7280',
    },
    messageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1B1D1F',
        marginBottom: 12,
    },
    errorMessage: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: '#4A60A1',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
});