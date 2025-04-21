import { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import { useAuthentication } from '../hooks/useAuthentication';
import { ActivityIndicator, View, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';

export default function RootLayout() {
  const { isAuthenticated, isLoading } = useAuthentication();
  const router = useRouter();
  const [initialAuthChecked, setInitialAuthChecked] = useState(false);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    if (isLoading) return;
    
    if (!initialAuthChecked) {
      setInitialAuthChecked(true);
      
      setTimeout(() => {
        if (!isAuthenticated) {
          router.replace('/login');
        } else {
          router.replace('/transactions');
        }
      }, 0);
    }
  }, [isAuthenticated, isLoading, initialAuthChecked]);

  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.background
      }}>
        <StatusBar 
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background}
        />
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }
  
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.background,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          animation: Platform.select({
            ios: 'default',
            android: 'slide_from_right',
            default: 'none'
          })
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false 
          }} 
        />        
        <Stack.Screen 
          name="transactions/index"
          options={{ 
            title: 'Transactions',
            headerTitle: 'Transactions',
            headerShown: true
          }} 
        />
        <Stack.Screen 
          name="transactions/[id]"
          options={{ 
            presentation: 'modal',
            headerShown: true,
            contentStyle: {
              backgroundColor: theme.background,
            },
            title: 'Transaction Details',
            headerLargeTitleStyle: {
              fontWeight: '700'
            }
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
