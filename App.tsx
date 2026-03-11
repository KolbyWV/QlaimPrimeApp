import "react-native-gesture-handler";
import React from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ApolloProvider } from "@apollo/client/react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useAppTheme } from "./src/ui/theme";
import { SessionProvider, useSession } from "./src/auth/session";
import { RootNavigator } from "./src/navigation";
import { LoadingState, Screen } from "./src/ui/components";
import {
  clearLastFatalError,
  installGlobalErrorHandler,
  readLastFatalError,
  recordFatalError,
} from "./src/utils/crashDiagnostics";

installGlobalErrorHandler();
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore if splash is already controlled by runtime.
});

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    recordFatalError("error-boundary", error, {
      componentStack: info?.componentStack || null,
    });
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={{ flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10 }}>App failed to render</Text>
        <Text selectable>{String(this.state.error?.message || this.state.error)}</Text>
      </View>
    );
  }
}

function AppShell() {
  const { apolloClient } = useSession();
  const { themeMode } = useAppTheme();

  React.useEffect(() => {
    let cancelled = false;

    async function reportRecoveredCrash() {
      const lastFatalError = await readLastFatalError();
      if (!lastFatalError || cancelled) return;

      console.error("[startup] recovered from prior fatal error", lastFatalError);
      await clearLastFatalError();
    }

    reportRecoveredCrash();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!apolloClient) return;

    SplashScreen.hideAsync().catch(() => {
      // Ignore hide errors to avoid blocking app render.
    });
  }, [apolloClient]);

  if (!apolloClient) {
    return (
      <Screen>
        <LoadingState label="Starting app..." />
      </Screen>
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
      <RootNavigator />
    </ApolloProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppErrorBoundary>
          <SessionProvider>
            <ThemeProvider>
              <AppShell />
            </ThemeProvider>
          </SessionProvider>
        </AppErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
