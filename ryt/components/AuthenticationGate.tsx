import React from 'react';
import { ActivityIndicator, StyleSheet, Pressable, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { useAuthentication } from '../hooks/useAuthentication';

type Props = {
  children: React.ReactNode;
};

export function AuthenticationGate({ children }: Props) {
  const { isAuthenticated, isLoading, authenticate } = useAuthentication();

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.text}>
          Please authenticate to view sensitive information
        </ThemedText>        
        <Pressable
          style={({pressed}) => [
            styles.button,
            pressed && { opacity: 0.7 }
          ]}
          onPress={() => {
            if (Platform.OS === 'web') {
              window.location.href = '/login';
            } else {
              authenticate();
            }
          }}
        >
          <ThemedText style={styles.buttonText}>
            {Platform.OS === 'web' ? 'Go to Login' : 'Authenticate with Biometrics'}
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
