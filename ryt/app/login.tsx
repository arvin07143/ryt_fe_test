import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ThemedText } from '../components/ThemedText';
import { ScreenLayout } from '../components/ScreenLayout';
import { PinInput } from '../components/PinInput';
import { useAuthentication } from '../hooks/useAuthentication';

export default function LoginScreen() {
  const { isAuthenticated, authenticate, isLoading } = useAuthentication();
  const router = useRouter();
  const [showPinInput, setShowPinInput] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setError('');
      setShowPinInput(false);
      router.replace('/transactions');
    }
  }, [isAuthenticated, router]);

  const handleAuth = () => {
    setError('');
    if (Platform.OS === 'web') {
      setShowPinInput(true);
    } else {
      authenticate();
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      <Image 
        source={require('../assets/images/react-logo.png')}
        style={styles.logo}
      />
      <ThemedText style={styles.title}>Welcome to Ryt Bank</ThemedText>
      <ThemedText style={styles.subtitle}>
        Your secure transaction partner
      </ThemedText>
      
      {error ? (
        <ThemedText style={styles.error}>{error}</ThemedText>
      ) : null}
      
      {Platform.OS === 'web' && showPinInput ? (
        <PinInput
          onSubmit={async (pin) => {
            setError('');
            const success = await authenticate(pin);
            if (!success) {
              setError('Incorrect PIN. Please try again.');
            }
          }}
          onCancel={() => {
            setError('');
            setShowPinInput(false);
          }}
          error={error}
          isLoading={isLoading}
        />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Authenticating...' : Platform.OS === 'web' ? 'Login with PIN' : 'Login with Biometrics'}
          </ThemedText>
        </TouchableOpacity>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 24,
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    maxWidth: 400,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
