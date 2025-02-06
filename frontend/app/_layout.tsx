import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null; // Keeps splash screen visible until fonts load
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Launching App with NewVideo Screen */}
     

        {/* Other Screens */}
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="screens/newvideo" options={{ title: 'NewVideo' }} />
        <Stack.Screen name="screens/summary" options={{ title: 'Summary' }} />
        <Stack.Screen name="screens/options" options={{ title: 'Options' }} />
        <Stack.Screen name="screens/quiz" options={{ title: 'Quiz' }} />
        <Stack.Screen name="screens/analytics" options={{ title: 'Analytics' }} />

        {/* Handle 404 - Not Found */}
        <Stack.Screen name="+not-found" options={{ title: 'Page Not Found' }} />
      </Stack>
      
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
